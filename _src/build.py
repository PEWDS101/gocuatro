"""Assemble the site from one shell + per-page content fragments.

There is no framework here. This exists so the header, nav, footer and phone
sheet live in exactly one file instead of being copy-pasted into six, which is
how nav links and phone numbers quietly drift out of sync.

    python _src/build.py

Reads  _src/template.html  and  _src/pages/<name>.html
       (fragments may pull in _src/partials/<name>.html via {{NAME}})
       and _src/config.py for every business value ({{EMAIL}}, {{PRICE_MENU}} …)
Writes <name>.html at the project root, and js/config.js so the JavaScript
       reads the same numbers the markup does.

The root .html files are GENERATED. Editing them works until the next build.
"""
import json
import os
import re

from config import BUSINESS, MAY_BE_EMPTY

D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(D, ".."))
PAGES = os.path.join(D, "pages")
PARTIALS = os.path.join(D, "partials")

# page id -> (title key, title, description key, description, og title)
META = {
    "index": (
        "meta.title", "GoCuatro — Custom Web Design & Development",
        "meta.description",
        "GoCuatro hand-builds custom websites from scratch. No templates, no page "
        "builders. Clean code, fast performance, mobile-first and SEO-ready. Based in "
        "Kurdistan, Iraq — working worldwide.",
        "GoCuatro — Crafted. Not Assembled.",
    ),
    "about": (
        "meta.about.title", "About — GoCuatro",
        "meta.about.description",
        "A small studio in Kurdistan, Iraq that writes every line by hand. Who we are "
        "and why hand-built beats a template.",
        "About GoCuatro",
    ),
    "services": (
        "meta.services.title", "Services — GoCuatro",
        "meta.services.description",
        "Custom websites, redesigns, landing pages and ongoing care. Hand-coded, fast, "
        "multilingual and built to be found.",
        "What GoCuatro builds",
    ),
    "work": (
        "meta.work.title", "Work — GoCuatro",
        "meta.work.description",
        "Five complete concept sites, each with its own identity, built end to end to "
        "show how we work.",
        "GoCuatro — selected work",
    ),
    "process": (
        "meta.process.title", "Process — GoCuatro",
        "meta.process.description",
        "How a GoCuatro project runs, from the first conversation to launch and after.",
        "How GoCuatro works",
    ),
    "contact": (
        "meta.contact.title", "Contact — GoCuatro",
        "meta.contact.description",
        "Start a project with GoCuatro. WhatsApp, Telegram, email or a call — and "
        "answers to the questions we are asked most.",
        "Talk to GoCuatro",
    ),
}

ORDER = ["index", "about", "services", "work", "process", "contact"]


def expand_partials(html):
    """Replace {{NAME}} with _src/partials/name.html, repeatedly so a partial may
    itself include another. Anything with no matching file is left alone for the
    caller to fill in."""
    for _ in range(6):
        hit = False
        for tag in set(re.findall(r"\{\{([A-Z][A-Z_0-9]*)\}\}", html)):
            p = os.path.join(PARTIALS, tag.lower() + ".html")
            if os.path.exists(p):
                with open(p, encoding="utf-8") as f:
                    html = html.replace("{{" + tag + "}}", f.read().strip())
                hit = True
        if not hit:
            break
    return html


def check_config():
    """A blank price or phone number must never reach a built page quietly."""
    blank = [k for k, v in BUSINESS.items()
             if not str(v).strip() and k not in MAY_BE_EMPTY]
    if blank:
        raise SystemExit("_src/config.py: %s has no value" % ", ".join(sorted(blank)))


def money(raw):
    """105000 -> "105,000".

    Grouped for reading; the RAW value is what goes in the JSON-LD, because
    schema.org wants a bare number and a comma there is a parse error waiting
    to happen. A Western comma is right for all three languages here: this site
    writes Western digits in Arabic and Kurdish too, so an Arabic thousands
    mark would be the odd one out."""
    return "{:,}".format(int(raw))


def apply_config(html):
    """Substitute every business value from _src/config.py.

    Each PRICE_* key yields TWO placeholders: {{PRICE_X}} is the raw integer
    for machines, {{PRICE_X_FMT}} is the grouped form for people. The longer
    name is substituted first, or "{{PRICE_MENU}}" would match inside
    "{{PRICE_MENU_FMT}}" and leave a stray "_FMT" on the page.

    Blocks wrapped in <!--IF:KEY--> … <!--/IF:KEY--> are dropped when that key
    is empty, so an unconfirmed social account leaves no broken icon behind
    rather than linking to nothing."""
    for key, value in BUSINESS.items():
        if key.startswith("PRICE_") and str(value).isdigit():
            html = html.replace("{{%s_FMT}}" % key, money(value))
        block = re.compile(
            r"[ \t]*<!--IF:%s-->.*?<!--/IF:%s-->[ \t]*\n?" % (key, key), re.S)
        if str(value).strip():
            # Take the WHOLE marker line -- its indentation and its newline as
            # well as the comment itself. Removing only the comment text left
            # the six spaces of indentation behind as a trailing-whitespace
            # line, on every kept <!--IF:--> block: 36 lines across the six
            # pages, and `git diff --check` failed on all of them.
            marker = r"[ \t]*<!--/?IF:%s-->[ \t]*\n?" % key
            html = re.sub(marker, "", html)
        else:
            html = block.sub("", html)
        html = html.replace("{{" + key + "}}", str(value))
    return html


def tidy(html):
    """Last pass before a page is written: no trailing whitespace on any line,
    and exactly one newline at the end of the file.

    The generator is the right place for this. A partial is edited by hand, a
    stray space at the end of a line is invisible in an editor, it survives
    into the built page, and then `git diff --check` fails on a file nobody
    typed. Fixing it here means it cannot come back, whatever anyone writes
    in _src/.

    Safe for this site: there is no <pre> anywhere, and no attribute value
    spans a line break, so nothing in the output depends on whitespace sitting
    immediately before a newline.
    """
    lines = [line.rstrip() for line in html.split("\n")]
    return "\n".join(lines).rstrip("\n") + "\n"


def write_config_js():
    """js/config.js — the same values, for the browser.

    Generated, so the phone number the brief form dials can never drift from
    the one printed on the contact card."""
    out = (
        "/* GENERATED by _src/build.py from _src/config.py — do not edit.\n"
        " * Change a value in _src/config.py and run `python _src/build.py`.\n"
        " * Words live in js/translations.js; only values live here. */\n"
        "window.GC_CONFIG = " + json.dumps(BUSINESS, indent=2, ensure_ascii=False)
        + ";\n")
    path = os.path.join(ROOT, "js", "config.js")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(out)
    return path


def build():
    check_config()
    with open(os.path.join(D, "template.html"), encoding="utf-8") as f:
        shell = f.read()

    # index.html is the site root, so its canonical is the bare domain
    canon = lambda n: BUSINESS["SITE"] + ("" if n == "index" else n + ".html")

    missing, written = [], []
    for name in ORDER:
        frag = os.path.join(PAGES, name + ".html")
        if not os.path.exists(frag):
            missing.append(name)
            continue
        with open(frag, encoding="utf-8") as f:
            body = expand_partials(f.read().strip())

        tkey, title, dkey, desc, og = META[name]
        out = (shell
               .replace("{{TKEY}}", tkey)
               .replace("{{TITLE}}", title)
               .replace("{{DKEY}}", dkey)
               .replace("{{DESC}}", desc)
               .replace("{{OG}}", og)
               .replace("{{PAGE}}", name)
               .replace("{{CANONICAL}}", canon(name))
               .replace("{{BODY}}", body))
        out = apply_config(out)

        out = tidy(out)

        # a stray placeholder means a typo in the template, not an empty value
        leftover = re.findall(r"\{\{[A-Z_0-9]+\}\}", out)
        if leftover:
            raise SystemExit("%s: unresolved placeholder(s) %s" % (name, set(leftover)))

        with open(os.path.join(ROOT, name + ".html"), "w",
                  encoding="utf-8", newline="\n") as f:
            f.write(out)
        written.append("  %-16s %3d KB" % (name + ".html", len(out) // 1024))

    print("\n".join(written))
    cfg = write_config_js()
    print("  %-16s from _src/config.py" % os.path.relpath(cfg, ROOT).replace("\\", "/"))
    if missing:
        print("\nno fragment yet for: " + ", ".join(missing))
    print("\n%d/%d pages built" % (len(written), len(ORDER)))


if __name__ == "__main__":
    build()
