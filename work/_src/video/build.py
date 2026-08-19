"""Composite the branded overlay frames with the real site recording, add music,
and write the final 1080x1920 reels.

  frames/<site>/*.jpg   branded overlay, deterministic, 25 fps
  raw/<site>.mp4        the actual site being used
  audio/tN.mp3          music bed

Output: out/<site>.mp4
"""
import json
import os
import pathlib
import subprocess
import sys

HERE = pathlib.Path(__file__).parent
OUT = HERE / 'out'; OUT.mkdir(exist_ok=True)
FPS = 25

# per-site music, chosen from the waveform/spectrum audition:
#   t3 even + driving, t4 dense + loud, t1 breathing sweeps,
#   t5 moderate steady, t8 tight and bass-light
TRACK = {'tenur': 't5', 'zana': 't8', 'zeri': 't1', 'zagros': 't3', 'hez': 't4'}

meta = json.loads((HERE / 'meta.json').read_text())


def mask(w, h, r=20):
    """Alpha mask: square top (it sits under the chrome bar), rounded bottom."""
    from PIL import Image, ImageDraw
    p = HERE / f'_mask_{w}x{h}.png'
    if not p.exists():
        im = Image.new('L', (w, h), 0)
        d = ImageDraw.Draw(im)
        d.rounded_rectangle([0, 0, w - 1, h - 1], radius=r, fill=255)
        d.rectangle([0, 0, w - 1, r], fill=255)          # un-round the top
        im.save(p)
    return p


def build(site):
    m = meta[site]
    s = m['slot']
    dur = m['frames'] / FPS
    src = HERE / 'raw' / f'{site}.mp4'
    music = HERE / 'audio' / f'{TRACK[site]}.mp3'
    dest = OUT / f'{site}.mp4'
    mk = mask(s['w'], s['h'])

    # video: overlay the recording into the slot, masked to the window's corners.
    # audio: normalise, trim, fade — the bed sits under the visuals, not over them.
    fc = (
        f"[1:v]scale={s['w']}:{s['h']}:flags=lanczos,format=rgba[vid];"
        f"[2:v]format=gray,scale={s['w']}:{s['h']}[mk];"
        f"[vid][mk]alphamerge[cut];"
        f"[0:v][cut]overlay={s['x']}:{s['y']}:format=auto[comp];"
        f"[comp]format=yuv420p,"
        f"eq=saturation=1.04:contrast=1.02[v];"
        f"[3:a]atrim=0:{dur:.3f},asetpts=N/SR/TB,"
        f"loudnorm=I=-17:TP=-1.5:LRA=11,"
        f"afade=t=in:st=0:d=1.2,afade=t=out:st={max(0, dur - 1.6):.3f}:d=1.6[a]"
    )

    cmd = [
        'ffmpeg', '-y', '-loglevel', 'error', '-stats',
        '-framerate', str(FPS), '-i', str(HERE / 'frames' / site / '%05d.jpg'),
        '-i', str(src),
        '-i', str(mk),
        '-stream_loop', '-1', '-i', str(music),
        '-filter_complex', fc,
        '-map', '[v]', '-map', '[a]',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
        '-profile:v', 'high', '-level', '4.1', '-r', str(FPS),
        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
        '-movflags', '+faststart', '-shortest',
        str(dest)
    ]
    subprocess.run(cmd, check=True)
    kb = dest.stat().st_size // 1024
    d = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                        '-of', 'csv=p=0', str(dest)], capture_output=True, text=True).stdout.strip()
    print(f'{site}.mp4  {float(d):.1f}s  {kb} KB  music={TRACK[site]}')


for site in (sys.argv[1:] or list(meta.keys())):
    build(site)
print('built')
