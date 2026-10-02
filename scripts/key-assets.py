#!/usr/bin/env python3
"""Cut out LABEL_01 assets. Fast bytearray flood-fill, no numpy."""
from collections import deque
from pathlib import Path
from PIL import Image

DL = Path("/Users/kajaskoufi/Downloads")
EMB = Path("/tmp/label01-embedded")
PAGES = Path("/tmp/label01-pages")
ROOT = Path(__file__).resolve().parents[1]
OUTS = [ROOT / "public" / "assets", ROOT / "dist" / "assets"]


def flood_key(im: Image.Image, thresh: int = 28, max_h: int = 1400, seed: str = "edges") -> Image.Image:
    im = im.convert("RGBA")
    if im.height > max_h:
        ratio = max_h / im.height
        im = im.resize((int(im.width * ratio), max_h), Image.Resampling.LANCZOS)
    w, h = im.size
    buf = bytearray(im.tobytes())
    dark = bytearray(w * h)
    t = thresh
    for i in range(w * h):
        o = i * 4
        if buf[o] < t and buf[o + 1] < t and buf[o + 2] < t:
            dark[i] = 1
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        q.append(x)
        if seed == "edges":
            q.append((h - 1) * w + x)
    side_limit = h if seed == "edges" else h // 5
    for y in range(side_limit):
        q.append(y * w)
        q.append(y * w + (w - 1))
    while q:
        i = q.popleft()
        if seen[i]:
            continue
        seen[i] = 1
        if not dark[i]:
            continue
        buf[i * 4 + 3] = 0
        x, y = i % w, i // w
        if x + 1 < w:
            q.append(i + 1)
        if x > 0:
            q.append(i - 1)
        if y + 1 < h:
            q.append(i + w)
        if y > 0:
            q.append(i - w)
    out = Image.frombytes("RGBA", (w, h), bytes(buf))
    bbox = out.getbbox()
    if bbox:
        l, t0, r, b = bbox
        pad = 8
        out = out.crop((max(0, l - pad), max(0, t0 - pad), min(w, r + pad), min(h, b + pad)))
    return out


def key_black(im: Image.Image, thresh: int = 28) -> Image.Image:
    """Global near-black key — fine for objects that are not black clothing."""
    im = im.convert("RGBA")
    w, h = im.size
    buf = bytearray(im.tobytes())
    t = thresh
    for i in range(0, len(buf), 4):
        if buf[i] < t and buf[i + 1] < t and buf[i + 2] < t:
            buf[i + 3] = 0
    out = Image.frombytes("RGBA", (w, h), bytes(buf))
    bbox = out.getbbox()
    if bbox:
        l, t0, r, b = bbox
        pad = 10
        out = out.crop((max(0, l - pad), max(0, t0 - pad), min(w, r + pad), min(h, b + pad)))
    return out


def save(im: Image.Image, name: str) -> None:
    for folder in OUTS:
        folder.mkdir(parents=True, exist_ok=True)
        im.save(folder / name, "PNG")
    print(f"{name:16} {im.size} {im.mode}")


def main() -> None:
    save(flood_key(Image.open(DL / "9250b5c1-3e6a-4149-8d92-99a797ad7efe.png")), "punch.png")
    save(flood_key(Image.open(DL / "a1b240f8-5432-4f15-965d-6ae97665b413 1.png")), "terminal.png")
    save(flood_key(Image.open(DL / "a8471a19-6d00-472b-94c5-bca3b3b6c299 1.png")), "gui.png")

    save(flood_key(Image.open(DL / "e71fc36d-dfbb-4d54-83e3-636e014c1b90.png"), seed="top"), "musk.png")
    save(flood_key(Image.open(DL / "6e911689-dded-4644-95a0-7669eee858f5.png"), seed="top"), "amodei.png")
    save(flood_key(Image.open(DL / "0962c8c4-79cc-4de3-81d4-c6f13f32512b.png"), seed="top"), "hassabis.png")
    save(flood_key(Image.open(DL / "09750143-6b67-497c-a0da-b4d8e1a4eca2.png"), seed="top"), "altman.png")

    p27 = Image.open(PAGES / "p27.png")
    save(p27.crop((860, 628, 1920, 978)), "cone.png")

    p18 = Image.open(PAGES / "p18.png")
    save(p18.crop((1100, 96, 1920, 1080)), "people.png")

    p25 = Image.open(PAGES / "p25.png").convert("RGB")
    save(p25.crop((928, 102, 1905, 978)), "washer.png")
    print("done")


if __name__ == "__main__":
    main()
