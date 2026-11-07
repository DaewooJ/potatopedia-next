#!/bin/bash
# Weekly on Netcup (pp-mediakit.timer, Mon 06:00 IST): rebuild the media kit PDF with live numbers and publish it.
set -euo pipefail
cd "$HOME/Projects/potatopedia-next"
export PATH="$HOME/.npm-global/bin:/usr/local/bin:/usr/bin:/bin"
git pull -q --rebase --autostash
node --import ./scripts/media-kit/resolve-ext.mjs scripts/media-kit/build.mjs --pdf-tool "$HOME/scripts/pdf.sh"
if ! git diff --quiet -- docs/media-kit.html; then
  git add docs/media-kit.html public/potatopedia-media-kit.pdf
  git commit -q -m "Media kit: weekly live numbers ($(date +%F))"
  git push -q origin HEAD:main
  echo "$(date) published"
else
  git checkout -- public/potatopedia-media-kit.pdf
  echo "$(date) no change"
fi
