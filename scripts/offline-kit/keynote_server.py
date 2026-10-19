#!/usr/bin/env python3
"""Tiny local server for the offline keynote (backup only; the single HTML file needs no server).

Python's built-in `-m http.server` takes MIME types from the Windows registry, which on some
PCs maps .css/.js to text/plain; Chrome/Edge then refuse the stylesheet and the page appears
unstyled. This server uses a fixed, explicit MIME table and never consults the registry.
"""
import http.server, os, socket, sys, threading, webbrowser
from functools import partial

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Keynote_offline")
MIME = {
    ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif",
    ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf",
    ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8",
}

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = dict(MIME)
    def guess_type(self, path):
        return MIME.get(os.path.splitext(path)[1].lower(), "application/octet-stream")
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()
    def log_message(self, *args):
        pass

def main():
    if not os.path.isdir(ROOT):
        print("Slozka Keynote_offline nenalezena vedle tohoto souboru. Rozbalte cely ZIP (Extrahovat vse).")
        input("Enter pro ukonceni..."); return 1
    handler = partial(Handler, directory=ROOT)
    server = None
    for port in range(8765, 8790):
        try:
            server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler); break
        except OSError:
            continue
    if server is None:
        print("Nepodarilo se najit volny port."); input("Enter pro ukonceni..."); return 1
    url = f"http://127.0.0.1:{server.server_address[1]}/index.html"
    print(f"Prezentace bezi na {url}", flush=True)
    print("Toto okno nechte otevrene po celou dobu prezentace. Ukonceni: Ctrl+C.", flush=True)
    if "--no-browser" not in sys.argv:
        threading.Timer(1.0, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0

if __name__ == "__main__":
    sys.exit(main())
