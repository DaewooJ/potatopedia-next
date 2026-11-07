#!/bin/bash
# Run ON NETCUP once (Devendra): installs the weekly media-kit timer (Mon 06:00 IST) and runs it once now.
set -euo pipefail
cd "$HOME/Projects/potatopedia-next"
git config user.name DaewooJ
git config user.email devenjha@gmail.com
mkdir -p "$HOME/.config/systemd/user" "$HOME/jobs/pp-mediakit"
cat > "$HOME/.config/systemd/user/pp-mediakit.service" <<EOT
[Unit]
Description=Potatopedia media kit PDF with live numbers
[Service]
Type=oneshot
ExecStart=$HOME/Projects/potatopedia-next/scripts/media-kit/weekly.sh
StandardOutput=append:$HOME/jobs/pp-mediakit/run.log
StandardError=append:$HOME/jobs/pp-mediakit/run.log
EOT
cat > "$HOME/.config/systemd/user/pp-mediakit.timer" <<EOT
[Unit]
Description=Potatopedia media kit weekly (Mon 06:00 IST)
[Timer]
OnCalendar=Mon *-*-* 06:00:00
Persistent=true
[Install]
WantedBy=timers.target
EOT
systemctl --user daemon-reload
systemctl --user enable --now pp-mediakit.timer
systemctl --user start pp-mediakit.service
tail -2 "$HOME/jobs/pp-mediakit/run.log"
systemctl --user list-timers pp-mediakit.timer --no-pager | sed -n 2p
