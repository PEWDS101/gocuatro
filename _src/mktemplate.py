# -*- coding: utf-8 -*-
"""One-shot: turn _head.html + _tail.html into _src/template.html.

Rewrites the single-page anchor nav into real page URLs, swaps the retired
phone number for the new one everywhere, and adds the Facebook link.
Kept for the record; the template is edited directly from here on.
"""
import io
import os
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SRC = os.path.join(ROOT, "_src")

head = io.open(os.path.join(SRC, "_head.html"), encoding="utf-8").read()
tail = io.open(os.path.join(SRC, "_tail.html"), encoding="utf-8").read()

# ── 1. the retired number, everywhere ────────────────────────────────────
NUM = [
    ("9647503482487", "9647750775533"),      # wa.me / t.me / JSON-LD
    ("07503482487", "07750775533"),          # tel:
    ("0750 348 2487", "0775 077 5533"),      # displayed
]
for a, b in NUM:
    head = head.replace(a, b)
    tail = tail.replace(a, b)

# ── 2. anchors become pages ──────────────────────────────────────────────
LINKS = [
    ('href="#about"', 'href="about.html"'),
    ('href="#services"', 'href="services.html"'),
    ('href="#work"', 'href="work.html"'),
    ('href="#process"', 'href="process.html"'),
    ('href="#faq"', 'href="contact.html#faq"'),
    ('href="#contact"', 'href="contact.html"'),
]
for a, b in LINKS:
    head = head.replace(a, b)
    tail = tail.replace(a, b)

# the brand and nav Home point at the index; the skip link stays in-page
head = head.replace('<a href="#top" class="nav__brand"', '<a href="index.html" class="nav__brand"')
head = head.replace('<a href="#top"      class="nav__a is-on" data-i18n="nav.home">',
                    '<a href="index.html" class="nav__a nav-home" data-i18n="nav.home">')
head = head.replace('<a href="#top"      data-i18n="nav.home">',
                    '<a href="index.html" data-i18n="nav.home">')
head = head.replace('<a class="skip" href="#top"', '<a class="skip" href="#main"')

# tag each nav item so CSS can mark the current page from body[data-page]
for sid in ("about", "services", "work", "process", "contact"):
    head = head.replace('href="%s.html"    class="nav__a"' % sid,
                        'href="%s.html" class="nav__a nav-%s"' % (sid, sid))
    head = head.replace('href="%s.html" class="nav__a"' % sid,
                        'href="%s.html" class="nav__a nav-%s"' % (sid, sid))

# ── 3. placeholders ──────────────────────────────────────────────────────
head = re.sub(r'<title[^>]*>.*?</title>', '<title data-i18n="{{TKEY}}">{{TITLE}}</title>', head, count=1)
head = re.sub(r'(<meta name="description" data-i18n-attr="content:)[^"]+(" content=")[^"]*(">)',
              r'\1{{DKEY}}\2{{DESC}}\3', head, count=1)
head = head.replace('<meta property="og:title" content="GoCuatro — Crafted. Not Assembled.">',
                    '<meta property="og:title" content="{{OG}}">')
head = head.replace("<body>", '<body data-page="{{PAGE}}">')
head = head.replace("<main>", '<main id="main">')
head = head.rstrip() + "\n{{BODY}}\n"

# ── 4. Facebook + Threads in the footer icon row ─────────────────────────
FB = '''      <a href="https://www.facebook.com/profile.php?id=61593175900925" target="_blank" rel="noopener" aria-label="Facebook">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 8.5h-2a1 1 0 0 0-1 1V12h3l-.5 3h-2.5v6.5"/><path d="M12.5 12H10v3h2.5"/><rect x="3" y="3" width="18" height="18" rx="5"/></svg>
      </a>
'''
anchor = '      <a href="https://instagram.com/gocuatro"'
tail = tail.replace(anchor, FB + anchor, 1)

io.open(os.path.join(SRC, "template.html"), "w", encoding="utf-8", newline="\n").write(head + tail)
print("template.html written")
for probe in ("{{TITLE}}", "{{BODY}}", "{{PAGE}}", "9647750775533", "facebook.com"):
    print("  %-18s %s" % (probe, "ok" if probe in (head + tail) else "MISSING"))
print("  old number left:", (head + tail).count("3482487"))
