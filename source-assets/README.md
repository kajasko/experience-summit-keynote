# Source assets (not part of the build)

`png/` holds the original lossless PNGs for images that the deck now serves as WebP
from `public/assets/*.webp` (quality 88, alpha kept). Edit/re-export from these, then
convert again, e.g. with Pillow: `Image.open(p).save(out, "WEBP", quality=88, method=6)`.
