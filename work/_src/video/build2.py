"""Encode the cinematic reels: frame sequence + music bed.

Everything visual is already baked into frames/<site>/, so this is just an
encode plus the audio mix.
"""
import json, pathlib, subprocess, sys

HERE = pathlib.Path(__file__).parent
OUT = HERE / 'out'; OUT.mkdir(exist_ok=True)
FPS = 25
TRACK = {'tenur': 't5', 'zana': 't8', 'zeri': 't1', 'zagros': 't3', 'hez': 't4'}
meta = json.loads((HERE / 'meta.json').read_text())


def build(site):
    m = meta[site]
    dur = m['frames'] / FPS
    music = HERE / 'audio' / f'{TRACK[site]}.mp3'
    dest = OUT / f'{site}.mp4'

    fc = (
        f"[1:a]atrim=0:{dur:.3f},asetpts=N/SR/TB,"
        f"loudnorm=I=-16:TP=-1.5:LRA=11,"
        f"afade=t=in:st=0:d=0.8,afade=t=out:st={max(0,dur-1.5):.3f}:d=1.5[a]"
    )
    cmd = [
        'ffmpeg', '-y', '-loglevel', 'error',
        '-framerate', str(FPS), '-i', str(HERE / 'frames' / site / '%05d.jpg'),
        '-stream_loop', '-1', '-i', str(music),
        '-filter_complex', fc,
        '-map', '0:v', '-map', '[a]',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p',
        '-profile:v', 'high', '-level', '4.1', '-r', str(FPS),
        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
        '-movflags', '+faststart', '-shortest', str(dest)
    ]
    subprocess.run(cmd, check=True)
    d = subprocess.run(['ffprobe','-v','error','-show_entries','format=duration',
                        '-of','csv=p=0',str(dest)], capture_output=True, text=True).stdout.strip()
    print(f'{site}.mp4  {float(d):.1f}s  {dest.stat().st_size//1024} KB')


for s in (sys.argv[1:] or list(meta.keys())):
    build(s)
print('built')
