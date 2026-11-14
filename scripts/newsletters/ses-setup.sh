#!/usr/bin/env bash
# SES + SNS setup for the Potatopedia newsletters (written 13 Nov 2026; NOT run yet).
#
# Run AFTER the nl-email code is deployed (the HTTPS subscription below is confirmed by
# https://www.potatopedia.com/api/newsletters/ses-events, which must be live), and after:
#     aws login --region ap-southeast-2 --profile dk
#
# What it does (safe to re-run; existing pieces are kept):
#   1. SES configuration set  potatopedia-newsletters   (reputation metrics on)
#   2. SNS topic               potatopedia-newsletter-events (+ policy letting SES in this account publish)
#   3. SES event destination   sns-events: DELIVERY, OPEN, CLICK, BOUNCE, COMPLAINT, REJECT, RENDERING_FAILURE
#      (adding OPEN + CLICK to an event destination is what turns on open + click tracking)
#   4. SNS HTTPS subscription  → https://www.potatopedia.com/api/newsletters/ses-events (the route confirms it itself)
# Check afterwards: aws sns list-subscriptions-by-topic --topic-arn <arn> → SubscriptionArn is an ARN, not "PendingConfirmation".
set -euo pipefail

REGION=ap-southeast-2
PROFILE=dk
CS=potatopedia-newsletters
TOPIC=potatopedia-newsletter-events
ENDPOINT=https://www.potatopedia.com/api/newsletters/ses-events
AWS=(aws --region "$REGION" --profile "$PROFILE")

ACCOUNT=$("${AWS[@]}" sts get-caller-identity --query Account --output text)
echo "Account $ACCOUNT, region $REGION"

# 1. Configuration set
if "${AWS[@]}" sesv2 get-configuration-set --configuration-set-name "$CS" >/dev/null 2>&1; then
  echo "Configuration set $CS exists"
else
  "${AWS[@]}" sesv2 create-configuration-set --configuration-set-name "$CS" \
    --sending-options SendingEnabled=true --reputation-options ReputationMetricsEnabled=true
  echo "Created configuration set $CS"
fi

# 2. SNS topic (create-topic is idempotent) + publish policy for SES
TOPIC_ARN=$("${AWS[@]}" sns create-topic --name "$TOPIC" --query TopicArn --output text)
echo "Topic $TOPIC_ARN"
POLICY=$(cat <<JSON
{"Version":"2012-10-17","Statement":[
 {"Sid":"OwnerAll","Effect":"Allow","Principal":{"AWS":"arn:aws:iam::$ACCOUNT:root"},"Action":["SNS:GetTopicAttributes","SNS:SetTopicAttributes","SNS:Subscribe","SNS:ListSubscriptionsByTopic","SNS:Publish","SNS:DeleteTopic"],"Resource":"$TOPIC_ARN"},
 {"Sid":"SesPublish","Effect":"Allow","Principal":{"Service":"ses.amazonaws.com"},"Action":"SNS:Publish","Resource":"$TOPIC_ARN",
  "Condition":{"StringEquals":{"AWS:SourceAccount":"$ACCOUNT"},"StringLike":{"AWS:SourceArn":"arn:aws:ses:$REGION:$ACCOUNT:configuration-set/$CS"}}}
]}
JSON
)
"${AWS[@]}" sns set-topic-attributes --topic-arn "$TOPIC_ARN" --attribute-name Policy --attribute-value "$POLICY"

# 3. Event destination (open + click tracking come from OPEN/CLICK here)
DEST=$(cat <<JSON
{"Enabled":true,"MatchingEventTypes":["DELIVERY","OPEN","CLICK","BOUNCE","COMPLAINT","REJECT","RENDERING_FAILURE"],"SnsDestination":{"TopicArn":"$TOPIC_ARN"}}
JSON
)
if "${AWS[@]}" sesv2 get-configuration-set-event-destinations --configuration-set-name "$CS" \
     --query "EventDestinations[?Name=='sns-events'].Name" --output text | grep -q sns-events; then
  "${AWS[@]}" sesv2 update-configuration-set-event-destination --configuration-set-name "$CS" \
    --event-destination-name sns-events --event-destination "$DEST"
  echo "Updated event destination sns-events"
else
  "${AWS[@]}" sesv2 create-configuration-set-event-destination --configuration-set-name "$CS" \
    --event-destination-name sns-events --event-destination "$DEST"
  echo "Created event destination sns-events"
fi

# 4. HTTPS subscription (raw delivery stays OFF: the route needs the signed SNS envelope)
"${AWS[@]}" sns subscribe --topic-arn "$TOPIC_ARN" --protocol https --notification-endpoint "$ENDPOINT" \
  --return-subscription-arn --query SubscriptionArn --output text
echo "Subscribed $ENDPOINT. Wait ~1 min, then:"
echo "  ${AWS[*]} sns list-subscriptions-by-topic --topic-arn $TOPIC_ARN"
