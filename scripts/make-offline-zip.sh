#!/usr/bin/env bash
# Build the offline package: single self-contained HTML + folder backup + launchers → keynote-offline.zip
set -euo pipefail
cd "$(dirname "$0")/.."
OUT_ZIP="${1:-/workspace/keynote-offline.zip}"
STAGE="${STAGE:-/workspace/pkg}"
PKG="$STAGE/Keynote_Experience_Summit_2026"
OFFLINE=1 npx vite build >/dev/null
sed -i 's#<script type="module" crossorigin src=#<script defer src=#; s#<link rel="stylesheet" crossorigin #<link rel="stylesheet" #' export/offline/index.html
python3 - <<'PY'
p = "export/offline/index.html"; s = open(p, encoding="utf-8").read()
hint = ('<div id="css-missing" style="font:18px/1.5 Segoe UI,Arial,sans-serif;max-width:720px;margin:40px auto;padding:24px;'
        'border:2px solid #c33;border-radius:12px;background:#fff6f6;color:#222">'
        '<b>Styly prezentace se nenačetly.</b><br>ZIP nejdřív rozbalte (pravý klik › Extrahovat vše) a otevřete soubor '
        '<b>Prezentace_Experience_Summit.html</b>, který funguje i samostatně.</div>')
if 'id="css-missing"' not in s: s = s.replace("<body>", "<body>\n    " + hint, 1)
open(p, "w", encoding="utf-8").write(s)
PY
node scripts/build-singlefile.mjs export/offline export/Prezentace_Experience_Summit.html
rm -rf "$STAGE"; mkdir -p "$PKG"
cp export/Prezentace_Experience_Summit.html "$PKG/"
cp -r export/offline "$PKG/Keynote_offline"
rm -f "$PKG/Keynote_offline/assets/PHOTOS.md"
cp scripts/offline-kit/{CTI_ME.txt,keynote_server.py,keynote-server.ps1,Spustit_prezentaci_zaloha_Windows.bat,Spustit_prezentaci_zaloha_Mac.command} "$PKG/"
chmod +x "$PKG/Spustit_prezentaci_zaloha_Mac.command" "$PKG/keynote_server.py"
rm -f "$OUT_ZIP"
python3 - "$OUT_ZIP" "$STAGE" <<'PY'
import os, sys, zipfile
out, stage = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for dp, dn, fn in os.walk(stage):
        dn.sort()
        for f in sorted(fn):
            full = os.path.join(dp, f); rel = os.path.relpath(full, stage)
            zi = zipfile.ZipInfo.from_file(full, rel)
            zi.compress_type = zipfile.ZIP_DEFLATED
            if f.endswith((".command", ".py")): zi.external_attr = (0o100755 << 16)
            with open(full, "rb") as fh: z.writestr(zi, fh.read())
PY
ls -lh "$OUT_ZIP"
