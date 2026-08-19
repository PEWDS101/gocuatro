"""Assemble the site from one shell + per-page content fragments.

There is no framework here. This exists so the header, nav, footer and phone
sheet live in exactly one file instead of being copy-pasted into six, which is
how nav links and phone numbers quietly drift out of sync.

    python _src/build.py

Reads  _src/template.html  and  _src/pages/<name>.html
       (fragments may pull in _src/partials/<name>.html via {{NAME}})
Writes <name>.html at the project root.

The root .html files are GENERATED. Editing them works until the next build.
"""
import os
import re

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


def build():
    with open(os.path.join(D, "template.html"), encoding="utf-8") as f:
        shell = f.read()

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
               .replace("{{BODY}}", body))

        # a stray placeholder means a typo in the template, not an empty value
        leftover = re.findall(r"\{\{[A-Z_0-9]+\}\}", out)
        if leftover:
            raise SystemExit("%s: unresolved placeholder(s) %s" % (name, set(leftover)))

        with open(os.path.join(ROOT, name + ".html"), "w",
                  encoding="utf-8", newline="\n") as f:
            f.write(out)
        written.append("  %-16s %3d KB" % (name + ".html", len(out) // 1024))

    print("\n".join(written))
    if missing:
        print("\nno fragment yet for: " + ", ".join(missing))
    print("\n%d/%d pages built" % (len(written), len(ORDER)))


if __name__ == "__main__":
    build()
