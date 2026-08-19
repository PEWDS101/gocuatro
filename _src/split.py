# -*- coding: utf-8 -*-
"""One-shot: carve the single-page index.html into a template + page fragments.

Run once. After this, _src/ is the source and `python _src/build.py` regenerates
the root .html files. This script is kept for the record, not for re-running.
"""
import io
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SRC = os.path.join(ROOT, "_src")
os.makedirs(os.path.join(SRC, "pages"), exist_ok=True)
os.makedirs(os.path.join(SRC, "partials"), exist_ok=True)

html = io.open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()

# ── split at <main> ──────────────────────────────────────────────────────
m_open = html.index("<main>")
m_close = html.index("</main>")
head = html[:m_open + len("<main>")]
body = html[m_open + len("<main>"):m_close]
tail = html[m_close:]

# ── pull each top-level <section id="..."> out of the body ───────────────
sections = {}
order = []
pat = re.compile(r'\n<!-- [═\s]*([A-Z][A-Z &]*?)[═\s]*-->\n(<section[^>]*id="([a-z-]+)"[\s\S]*?\n</section>)')
for mm in pat.finditer(body):
    label, block, sid = mm.group(1).strip(), mm.group(2), mm.group(3)
    sections[sid] = block
    order.append((sid, label))

if not sections:  # fall back to plain section scan
    for mm in re.finditer(r'(<section[^>]*id="([a-z-]+)"[\s\S]*?\n</section>)', body):
        sections[mm.group(2)] = mm.group(1)
        order.append((mm.group(2), mm.group(2)))

print("sections found:", ", ".join(s for s, _ in order))

io.open(os.path.join(SRC, "_head.html"), "w", encoding="utf-8", newline="\n").write(head)
io.open(os.path.join(SRC, "_tail.html"), "w", encoding="utf-8", newline="\n").write(tail)
for sid, _ in order:
    io.open(os.path.join(SRC, "partials", "sec_%s.html" % sid), "w",
            encoding="utf-8", newline="\n").write(sections[sid].strip() + "\n")
print("wrote %d section partials + _head.html + _tail.html" % len(order))
