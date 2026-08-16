"""Video helper: probe candidate Pexels clips, build a contact sheet, then encode a
web-ready loop.

  python vid.py probe  <tag> <url> [<url> ...]     -> _src/probe-<tag>.jpg contact sheet
  python vid.py make   <site> <name> <url> <start> <dur> [crop]
"""
import os
import subprocess
import sys

import requests
from PIL import Image, ImageDraw

SRC = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SRC)
CACHE = os.path.join(SRC, "cache")
os.makedirs(CACHE, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}


def hd(url):
    """Swap a Pexels SD preview URL for its 1080p sibling."""
    for a, b in ((("-sd_640_360"), "-hd_1920_1080"), ("_640_360", "_1920_1080"),
                 ("_360_640", "_1080_1920")):
        if a in url:
            return url.replace(a, b)
    return url


def grab(url):
    dest = os.path.join(CACHE, url.rsplit("/", 1)[-1].split("?")[0])
    if os.path.exists(dest) and os.path.getsize(dest) > 5000:
        return dest
    with requests.get(url, headers=UA, stream=True, timeout=180) as r:
        r.raise_for_status()
        with open(dest, "wb") as fh:
            for chunk in r.iter_content(1 << 18):
                fh.write(chunk)
    return dest


def frames(path, times=(0.8, 3.0, 6.0)):
    out = []
    for i, t in enumerate(times):
        p = path + f".{i}.jpg"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(t), "-i", path,
                        "-frames:v", "1", "-vf", "scale=380:-1", p], check=False)
        if os.path.exists(p):
            out.append(p)
    return out


def probe(tag, urls):
    rows = []
    for u in urls:
        try:
            p = grab(hd(u))
            rows.append((u.rsplit("/", 1)[-1][:34], frames(p)))
            print("got", p, os.path.getsize(p) // 1024, "KB")
        except Exception as e:
            print("fail", u, e)
    if not rows:
        return
    cw, ch = 380, 214
    sheet = Image.new("RGB", (cw * 3 + 40, (ch + 26) * len(rows) + 10), "#111")
    d = ImageDraw.Draw(sheet)
    for r, (label, fs) in enumerate(rows):
        y = r * (ch + 26) + 10
        d.text((12, y - 2), f"[{r}] {label}", fill="#8f8")
        for c, f in enumerate(fs):
            im = Image.open(f).convert("RGB")
            im = im.resize((cw, round(im.height * cw / im.width)), Image.LANCZOS)
            sheet.paste(im, (12 + c * (cw + 8), y + 16))
    out = os.path.join(SRC, f"probe-{tag}.jpg")
    sheet.save(out, quality=84)
    print("SHEET", out)


def make(site, name, url, start, dur, crop=None):
    src = grab(hd(url))
    out_dir = os.path.join(ROOT, site, "media")
    os.makedirs(out_dir, exist_ok=True)
    vf = "scale=1600:-2"
    if crop:
        vf = f"crop={crop},{vf}"
    vf += ",format=yuv420p"
    mp4 = os.path.join(out_dir, name + ".mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(start), "-t", str(dur),
                    "-i", src, "-an", "-vf", vf, "-c:v", "libx264", "-profile:v", "high",
                    "-crf", "30", "-preset", "slow", "-movflags", "+faststart",
                    "-g", "48", mp4], check=True)
    # poster frame so the hero has something to show before the video decodes
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(start + 0.4), "-i", src,
                    "-frames:v", "1", "-vf", "scale=1600:-2", os.path.join(out_dir, name + "-poster.jpg")],
                   check=False)
    print(f"{site}/{name}.mp4  {os.path.getsize(mp4)//1024}KB")


if __name__ == "__main__":
    if sys.argv[1] == "probe":
        probe(sys.argv[2], sys.argv[3:])
    else:
        make(sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]), float(sys.argv[6]),
             sys.argv[7] if len(sys.argv) > 7 else None)
