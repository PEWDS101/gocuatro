# Concept sites

Five complete, working websites built as GoCuatro's portfolio. They are **concepts** —
invented businesses, no real client involved, so nothing here needs anyone's permission
and nobody can decline. Every one is labelled *Concept* on the homepage card and again in
its own footer. Keep those labels: presenting a concept as delivered client work is the
one thing a serious client will check.

| Folder | Business | Direction | The thing to show people |
|---|---|---|---|
| `tenur/` | Kurdish tandoor & kebab house | Ember dark, saffron, Fraunces | Hover a dish — its photo follows the cursor |
| `zana/` | Dental studio | Porcelain light, sage, Gabarito | Drag the before/after slider |
| `zeri/` | Womenswear boutique | Ink editorial, Bodoni Moda | Add to bag — the cart totals live |
| `zagros/` | Car dealership | Near-black, signal red, Archivo | Sort the stock, switch the car's colour |
| `hez/` | Athletic club | Electric blue, Anton condensed | The countdown is real — it reads the timetable |

Each folder is self-contained: `index.html`, `style.css`, `app.js`, `media/`. No build
step, no dependencies, no framework. Upload a folder anywhere and it works.

## What they all share

- **Three languages** — English, Kurdish (Sorani) and Arabic, switchable in the header.
  Arabic flips the whole layout to RTL. Kurdish stays LTR, matching the main site's
  decision (see the main `README.md`).
- **Real photography and video**, downloaded and optimised into `media/` as WebP and
  compressed MP4. Nothing is hot-linked, so nothing breaks if a third party goes away.
  Sources are Unsplash (photos) and Pexels (video) — both licensed for free commercial
  use with no attribution required. `_src/CREDITS.md` records what came from where.
- **Motion everywhere**, all CSS transforms and opacity driven by IntersectionObserver.
  No animation library. Everything stops under `prefers-reduced-motion`, and every
  reveal has a timeout failsafe so a script error can never leave a page blank.
- **Forms do nothing on purpose.** They validate, then say plainly that this is a
  demonstration site and nothing was sent.

## Two traps worth remembering

**`[hidden]` loses to your own `display`.** The mobile menu panels are
`display:grid`, which beats the browser's built-in `[hidden]{display:none}` — so the
panel rendered over the desktop layout until every stylesheet got an explicit
`[hidden]{display:none !important}`. If a panel ever leaks onto desktop again, that
rule is what went missing.

**Clipped reveals eat descenders.** The headline animation works by translating text
inside `.line{overflow:hidden}`. With a tight `line-height`, that clips the tails of
g, y, p — "begins." rendered as "beains." for a while. Each `.line` now carries
`padding-block-end:.34em` with a matching negative margin, and the start transform is
`translateY(158%)` so the taller box still hides the text before it animates in.
Change one of those and you have to change the other.

## Regenerating the homepage preview cards

The cards in the main site's Work section are real screenshots. To refresh them, serve
the site and run headless Chrome — `work/_src/` holds the helper scripts
(`fetch_media.py` for photos, `vid.py` for video).
