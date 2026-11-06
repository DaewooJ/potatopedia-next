// Basic auth for /admin/* (proxy.js) and a second check inside admin server actions.
// Env: ADMIN_USER, ADMIN_PASSWORD (Vercel). With either unset, admin is closed to everyone.
export function adminOk(authHeader) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass || !authHeader?.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = atob(authHeader.slice(6));
  } catch {
    return false;
  }
  const expected = `${user}:${pass}`;
  if (decoded.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= decoded.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
