// SES mailer for the newsletters (private folder: not a route). Env: SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY,
// SES_REGION (ap-southeast-2). From newsletters@potatopedia.com (verified domain identity), Reply-To hi@.
// Mail is skipped (returns null) while SES env is unset, like /api/lead.
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { FROM, REPLY_TO } from "@/lib/newsletters";

export const CONFIG_SET = "potatopedia-newsletters";
export const REGION = process.env.SES_REGION || "ap-southeast-2";
let client = null;

function ses() {
  if (!process.env.SES_ACCESS_KEY_ID || !process.env.SES_SECRET_ACCESS_KEY) return null;
  if (!client) {
    client = new SESv2Client({
      region: REGION,
      credentials: { accessKeyId: process.env.SES_ACCESS_KEY_ID, secretAccessKey: process.env.SES_SECRET_ACCESS_KEY },
    });
  }
  return client;
}

const tag = (v) => String(v).replace(/[^A-Za-z0-9_\-.@]/g, "_").slice(0, 256);

// One mail. unsubUrl → List-Unsubscribe + List-Unsubscribe-Post (RFC 8058 one-click), via SESv2 Simple Headers.
// tags → SES EmailTags (they come back on every open/click/bounce event as mail.tags).
export async function sesSend({ to, subject, html, text, unsubUrl = null, tags = null, configSet = true }) {
  const c = ses();
  if (!c) return null;
  const Headers = unsubUrl
    ? [
        { Name: "List-Unsubscribe", Value: `<${unsubUrl}>` },
        { Name: "List-Unsubscribe-Post", Value: "List-Unsubscribe=One-Click" },
      ]
    : undefined;
  const out = await c.send(
    new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [to] },
      ReplyToAddresses: [REPLY_TO],
      // Tracking (opens/clicks) only once scripts/newsletters/ses-setup.sh has created the set: env NEWSLETTER_TRACKING=on.
      ConfigurationSetName: configSet && process.env.NEWSLETTER_TRACKING === "on" ? CONFIG_SET : undefined,
      EmailTags: tags ? Object.entries(tags).map(([Name, Value]) => ({ Name, Value: tag(Value) })) : undefined,
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: { Html: { Data: html, Charset: "UTF-8" }, ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}) },
          Headers,
        },
      },
    }),
  );
  return out.MessageId || null;
}
