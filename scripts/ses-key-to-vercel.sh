#!/bin/zsh
# Creates an access key for IAM user potatopedia-ses-send and pipes it straight into Vercel env
# (production + preview). The secret is never printed. Run once: ! zsh scripts/ses-key-to-vercel.sh
set -e
cd "$(dirname "$0")/.."
json=$(aws iam create-access-key --region us-east-1 --user-name potatopedia-ses-send)
id=$(print -r -- "$json" | python3 -c 'import json,sys;print(json.load(sys.stdin)["AccessKey"]["AccessKeyId"])')
sec=$(print -r -- "$json" | python3 -c 'import json,sys;print(json.load(sys.stdin)["AccessKey"]["SecretAccessKey"])')
for e in production preview; do
  printf '%s' "$id"  | vercel env add SES_ACCESS_KEY_ID "$e" --scope djkha >/dev/null
  printf '%s' "$sec" | vercel env add SES_SECRET_ACCESS_KEY "$e" --scope djkha --sensitive >/dev/null
done
unset json sec
echo "Done: SES key ${id} added to Vercel (production + preview)."
