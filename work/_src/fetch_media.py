"""Download the chosen Unsplash photos and write optimised WebP into each site's media dir.

Unsplash License: free to use, commercial use allowed, no permission needed.
Credits are recorded in work/_src/CREDITS.md.
"""
import io
import os
import sys
import concurrent.futures as cf

import requests
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

# site -> [(outname, unsplash_id, target_width, crop_ratio_or_None)]
# crop ratio is w/h; None keeps the source aspect.
PLAN = {
    "tenur": [
        ("hero-tandoor", "1763951718950-c536b1295213", 1920, 16 / 9),
        ("grill-wide",   "1626323109252-0adb3b46692b", 1600, 16 / 9),
        ("grill-close",  "1597354060917-2c56d7467f73", 1100, 4 / 5),
        ("dish-kebab",   "1603360946369-dc9bb6258143", 1100, 4 / 5),
        ("dish-plate",   "1620167790054-de54f34308bb", 1100, 4 / 5),
        ("dish-tray",    "1628294896516-344152572ee8", 1100, 4 / 5),
        ("dish-mezze",   "1653983194833-7a10838b12f4", 1100, 4 / 5),
        ("cook",         "1730082460730-573793ec7c8f", 1400, 3 / 4),
        ("room",         "1709548145082-04d0cde481d4", 1600, 3 / 2),
        ("room-warm",    "1701722952679-beffce26d77a", 1400, 3 / 2),
        ("lamps",        "1552960226-639240203497",    1200, 1),
    ],
    "zana": [
        ("hero-clinic",  "1629909613654-28e377c37b09", 1920, 16 / 9),
        ("smile-after",  "1489278353717-f64c6ee8a4d2", 1200, 1),
        ("smile-before", "1677026010083-78ec7f1b84ed", 1200, 1),
        ("scanner",      "1667133295315-820bb6481730", 1400, 3 / 2),
        ("exam",         "1606811971618-4486d14f3f99", 1200, 4 / 3),
        ("implant",      "1593022356769-11f762e25ed9", 1100, 1),
        ("room",         "1643660526741-094639fbe53a", 1400, 3 / 2),
        ("staff",        "1588776814546-daab30f310ce", 1100, 4 / 5),
    ],
    "zeri": [
        ("hero-look",    "1601597565151-70c4020dc0e1", 1600, 3 / 4),
        ("look-01",      "1633381521050-26bb467d9d5a", 1000, 3 / 4),
        ("look-02",      "1612928414075-bc722ade44f1", 1000, 3 / 4),
        ("look-03",      "1662532577856-e8ee8b138a8b", 1000, 3 / 4),
        ("look-04",      "1529408570047-e4414fb17e95", 1000, 3 / 4),
        ("look-05",      "1613915617430-8ab0fd7c6baf", 1000, 3 / 4),
        ("look-06",      "1536180838057-b604200e6f36", 1000, 3 / 4),
        ("store",        "1603400521630-9f2de124b33b", 1600, 16 / 9),
        ("store-alt",    "1441984904996-e0b6ba687e04", 1400, 3 / 2),
    ],
    "zagros": [
        ("hero-suv",     "1779813377620-7615c9e3796c", 1920, 16 / 9),
        ("car-01",       "1700884520248-92092bd21e63", 1300, 3 / 2),
        ("car-02",       "1760552234270-4702f8e3f750", 1300, 3 / 2),
        ("car-03",       "1767749995450-7b63ab7cd4fd", 1300, 3 / 2),
        ("car-04",       "1779983625011-e9c207710d11", 1300, 3 / 2),
        ("car-05",       "1776924550855-ebe29ac3a13c", 1300, 3 / 2),
        ("car-06",       "1758217209786-95458c5d30a7", 1300, 3 / 2),
        ("car-07",       "1747414632749-6c8b14ba30fd", 1300, 3 / 2),
        ("detail",       "1570829194611-71a926d70ff8", 1400, 16 / 9),
        ("showroom",     "1776723210515-c7fad08ff3cd", 1600, 16 / 9),
    ],
    "hez": [
        ("hero-floor",   "1778828450059-f39d5bbb01af", 1920, 16 / 9),
        ("kettlebell",   "1597076537061-a6b58163aa45", 1200, 1),
        ("dumbbells",    "1609674248079-e9242e48c06b", 1200, 1),
        ("athlete",      "1690908719292-ce05715e6cad", 1300, 3 / 4),
        ("training",     "1526402891769-ae1d9ceaec0a", 1300, 3 / 4),
        ("rowing",       "1764595753275-d9278a0b8f56", 1400, 3 / 2),
        ("bikes",        "1760031670160-4da44e9596d0", 1400, 3 / 2),
        ("floor-wide",   "1775993167276-743bbcde77e1", 1600, 16 / 9),
    ],
}


def cover_crop(im, ratio):
    """Centre-crop to `ratio` (w/h) without distorting."""
    w, h = im.size
    cur = w / h
    if abs(cur - ratio) < 0.01:
        return im
    if cur > ratio:                       # too wide -> trim sides
        new_w = int(h * ratio)
        off = (w - new_w) // 2
        return im.crop((off, 0, off + new_w, h))
    new_h = int(w / ratio)                # too tall -> trim top/bottom
    off = int((h - new_h) * 0.40)         # bias slightly above centre
    return im.crop((0, off, w, off + new_h))


def one(site, name, uid, width, ratio):
    out_dir = os.path.join(ROOT, site, "media")
    os.makedirs(out_dir, exist_ok=True)
    dest = os.path.join(out_dir, name + ".webp")
    tiny = os.path.join(out_dir, name + "-blur.webp")
    if os.path.exists(dest) and os.path.exists(tiny):
        return f"skip  {site}/{name}"

    url = (f"https://images.unsplash.com/photo-{uid}"
           f"?w={min(width * 2, 2400)}&q=82&fm=jpg&fit=max")
    r = requests.get(url, headers=UA, timeout=60)
    r.raise_for_status()
    im = Image.open(io.BytesIO(r.content)).convert("RGB")

    if ratio:
        im = cover_crop(im, ratio)
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(dest, "WEBP", quality=76, method=6)

    # 24px blurred placeholder -> inlined as a base64 LQIP so nothing pops in
    lq = im.resize((24, max(1, round(24 * im.height / im.width))), Image.LANCZOS)
    lq = lq.filter(ImageFilter.GaussianBlur(1.1))
    lq.save(tiny, "WEBP", quality=42, method=6)

    return f"ok    {site}/{name}.webp  {os.path.getsize(dest)//1024}KB  {im.width}x{im.height}"


jobs = [(s, *spec) for s, specs in PLAN.items() for spec in specs]
only = sys.argv[1] if len(sys.argv) > 1 else None
if only:
    jobs = [j for j in jobs if j[0] == only]

fails = []
with cf.ThreadPoolExecutor(max_workers=8) as ex:
    futs = {ex.submit(one, *j): j for j in jobs}
    for f in cf.as_completed(futs):
        j = futs[f]
        try:
            print(f.result())
        except Exception as e:
            fails.append(f"{j[0]}/{j[1]}: {type(e).__name__} {e}")

print(f"\n{len(jobs) - len(fails)}/{len(jobs)} ok")
for f in fails:
    print("FAIL", f)
