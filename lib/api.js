export const API = "https://potatopedia-backend.onrender.com";

const MAX_HISTORY_TURNS = 3; // last 3 user+assistant exchanges
const ASSISTANT_TRUNCATE = 500; // chars of assistant reply to include

/**
 * Build a conversation_history payload from a chat-style message array.
 *
 * The chat UI stores turns as { role: "user" | "ai", text: string }, but the
 * backend's conversation_history expects role "user" | "assistant". This maps
 * "ai" -> "assistant" so prior ANSWERS are actually included. Previously they
 * were silently dropped (role "ai" matched neither branch), so follow-ups like
 * "More" reached the backend with no usable context and couldn't be rewritten
 * — retrieving random content (~0.377) instead of the prior topic.
 *
 * Returns undefined when there's no usable history, so callers can spread it
 * into the body without polluting the request.
 */
export function buildHistory(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return undefined;
  const pairs = messages
    .filter((m) => m && !m.streaming && typeof m.text === "string" && m.text.trim())
    .filter((m) => m.role === "user" || m.role === "ai" || m.role === "assistant")
    .slice(-MAX_HISTORY_TURNS * 2)
    .map((m) => {
      const role = m.role === "user" ? "user" : "assistant";
      return {
        role,
        content: role === "assistant" ? m.text.slice(0, ASSISTANT_TRUNCATE) : m.text,
      };
    });
  return pairs.length > 0 ? pairs : undefined;
}

/**
 * POST to /ask (non-streaming). Returns JSON { answer, confidence, sources, ... }
 */
export async function fetchAPI(question, country, conversationHistory) {
  const res = await fetch(API + "/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      country: country || undefined,
      conversation_history: conversationHistory && conversationHistory.length > 0 ? conversationHistory : undefined,
    }),
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

/**
 * POST to /ask/stream (SSE streaming).
 * Calls onToken(text), onDone(event), onError(err) as events arrive.
 * Optional onRewrite(rewrittenQuestion) is invoked when the backend rewrites a
 * follow-up query into a self-contained question (emitted as its own SSE event
 * before any tokens).
 */
export async function fetchStream(body, onToken, onDone, onError, onRewrite) {
  try {
    const r = await fetch(API + "/ask/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const event = JSON.parse(line.slice(6));
        if (event.type === "error") {
          // Backend-reported failure (see /ask/stream error event). Tag it so the
          // UI can distinguish this from a network/timeout failure, and carry the
          // safe failure category through for debugging.
          const err = new Error(event.message || "Backend error");
          err.backendError = true;
          err.category = event.category || "internal_error";
          throw err;
        }
        if (event.type === "rewritten_question") {
          if (onRewrite) onRewrite(event.text);
          continue;
        }
        if (event.type === "token") onToken(event.text);
        if (event.type === "done") onDone(event);
      }
    }
    if (buffer.startsWith("data: ")) {
      const event = JSON.parse(buffer.slice(6));
      if (event.type === "token") onToken(event.text);
      if (event.type === "done") onDone(event);
    }
  } catch (e) {
    // Always log the real cause to the browser console so future failures are
    // debuggable from devtools (the user only ever sees a friendly message).
    const kind = e && e.backendError ? `backend:${e.category}` : "network";
    console.error(`[ask/stream] failed (${kind}):`, e && e.message ? e.message : e);
    if (onError) onError(e);
  }
}

/**
 * GET /stats — returns { total_chunks, unique_sources, categories }
 */
export async function fetchStats() {
  const res = await fetch(API + "/stats");
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}
