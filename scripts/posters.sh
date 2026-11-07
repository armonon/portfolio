#!/usr/bin/env bash
# Generate a poster frame for every video under public/videos (public/videos/posters/<same path>.jpg).
# Run after adding or replacing a video:  bash scripts/posters.sh
set -euo pipefail
cd "$(dirname "$0")/../public/videos"
find . -name '*.mp4' -not -path './posters/*' | while read -r f; do
  out="posters/${f#./}"; out="${out%.mp4}.jpg"
  [ -f "$out" ] && [ "$out" -nt "$f" ] && continue
  mkdir -p "$(dirname "$out")"
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f" </dev/null)
  t=$(awk -v d="$d" 'BEGIN{t=d*0.15; if(t>2.5)t=2.5; printf "%.2f", t}')
  ffmpeg -nostdin -v error -y -ss "$t" -i "$f" -frames:v 1 -vf "scale='min(1280,iw)':-2" -q:v 5 "$out"
  echo "poster: $out"
done
