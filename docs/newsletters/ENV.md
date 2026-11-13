# Newsletters: environment (13 Nov 2026)

## NEWSLETTER_API_SECRET (new, required)

Guards the internal routes `/api/newsletters/publish`, `/api/newsletters/send` and `/api/revalidate`
(header `x-newsletter-secret`). While it is unset (or shorter than 16 characters) those routes answer 403 to everyone.
The same value must be in three places: Vercel production, Vercel preview, and the Netcup file netweb reads.

Generate once (do not commit, do not paste into chats or docs):

```
openssl rand -hex 32
```

Add to Vercel (project potatopedia-next, scope djkha); paste the value when asked:

```
vercel env add NEWSLETTER_API_SECRET production
vercel env add NEWSLETTER_API_SECRET preview
```

Add to Netcup (the file netweb and the backend jobs source):

```
ssh netcup 'mkdir -p ~/.config/potatopedia && umask 077 && printf "NEWSLETTER_API_SECRET=%s\n" "<value>" >> ~/.config/potatopedia/newsletter.env && chmod 600 ~/.config/potatopedia/newsletter.env'
```

Redeploy after adding it (env changes reach only new deployments). To rotate: generate a new value, replace it in all
three places, redeploy.

## Already set (used as they are)

| Var | Use |
|---|---|
| `DATABASE_URL` | Neon potatopedia-db (subscriptions, issues, email_sends, email_events, leads) |
| `SES_ACCESS_KEY_ID`, `SES_SECRET_ACCESS_KEY`, `SES_REGION` (ap-southeast-2) | SES sends. From `newsletters@potatopedia.com` (verified domain identity, DKIM + MAIL FROM), Reply-To `hi@potatopedia.com`. While unset, opt-in mails are skipped (rows still saved) and `/send` answers 503. |
| `ADMIN_USER`, `ADMIN_PASSWORD` | basic auth for `/admin/newsletters` (proxy.js) |

The SES IAM user needs `ses:SendEmail` on the identity **and** on the configuration set
`arn:aws:ses:ap-southeast-2:<account>:configuration-set/potatopedia-newsletters`. If it was scoped to the identity only,
issue sends fail with AccessDenied: add the configuration-set ARN to its policy.

## SES / SNS (once, after the first deploy of this code)

1. `aws login --region ap-southeast-2 --profile dk`
2. `bash scripts/newsletters/ses-setup.sh` (configuration set, SNS topic, open/click/bounce/complaint event destination,
   HTTPS subscription to https://www.potatopedia.com/api/newsletters/ses-events).
3. The route confirms the SNS subscription by itself. Check:
   `aws sns list-subscriptions-by-topic --region ap-southeast-2 --profile dk --topic-arn <arn>`: the SubscriptionArn
   must be an ARN, not `PendingConfirmation`. If it is still pending, the deployment was not live or the signature check
   failed: look at the Vercel function logs for `/api/newsletters/ses-events`, then re-run step 2.
4. Send a test copy before any real send:
   `curl -X POST https://www.potatopedia.com/api/newsletters/send -H "x-newsletter-secret: $NEWSLETTER_API_SECRET" -H 'content-type: application/json' -d '{"issue_id":<id>,"test_to":"hi@potatopedia.com"}'`
