# GoCuatro — website

A complete, self-contained static site. No build step, no dependencies, no server code.
Upload the folder to any web host and it works.

```
gocuatro-website/
├── index.html          the whole site (one page, four sections)
├── css/
│   └── style.css       all styling
├── js/
│   ├── translations.js all wording, in all three languages  ← edit text here
│   └── main.js         menu, language switching, phone sheet, form
├── assets/
│   ├── logo-lockup.png    horizontal logo — used in header + footer
│   ├── logo-mark.png      G4 monogram on its own
│   ├── logo-stack.png     stacked lockup (mark over wordmark)
│   ├── logo-512.png       social sharing image
│   ├── favicon-64.png     browser tab icon
│   ├── apple-touch-icon.png
│   └── logo-original.jpg  your master artwork, kept for reference
└── README.md
```

## Putting it online

**Cloudflare Pages** — in the dashboard go to Workers &amp; Pages → Create →
Pages → *Upload assets*, then drag this whole folder in. There is no build
command and no framework preset to choose: it is already the finished output.
Leave the build settings empty and deploy.

If you connect a Git repo instead, set **Build command** to nothing and
**Build output directory** to `/`.

For any other host, upload the **contents** of this folder to the public
directory (`public_html`, `www`, `htdocs` — the name varies), with `index.html`
at the top. Netlify, Vercel and GitHub Pages all work the same drag-and-drop way.

## Changing the text

Everything written on the site lives in `js/translations.js`, grouped by language
(`en`, `ar`, `ckb`). Find the line, change the words between the quotes, save.
Change all three languages so they stay in step.

## Your contact details

These are already live and working:

| Where | What it does |
|---|---|
| Email | Opens Gmail compose, addressed to `GoCuatro4@gmail.com`, on phone and desktop |
| Phone | Opens a panel offering WhatsApp, Telegram, or a direct call |
| Instagram | Opens `instagram.com/gocuatro` |
| Short brief form | Writes the enquiry into a pre-filled Gmail message — no backend required |

**To change the Instagram handle**, replace `gocuatro` in the two
`https://instagram.com/gocuatro` links in `index.html`.

**To change the phone number**, update all four places in `index.html`:
`https://wa.me/9647503482487`, `https://t.me/+9647503482487`, `tel:07503482487`,
and the two displayed `0750 348 2487` labels.

**To change the email**, update the `MAIL_TO` value at the top of `js/main.js`
and the `mail.google.com` links in `index.html`.

## Languages

English is the default. Arabic switches the whole layout to right-to-left.

Sorani Kurdish is set to **left-to-right**, as you asked. Kurdish is written in
Arabic script and normally runs right-to-left — if you'd rather it did, change one
value in `js/translations.js`:

```js
ckb: { label: "کوردی", dir: "ltr",   ← change to "rtl"
```

The visitor's choice is remembered in their browser for next time.

## Design notes

Deliberately minimal: one dark ground, one accent, and a lot of open space.
Restraint is the whole idea — the moment a second accent or a second shape
language appears, the page stops reading as clean.

**Colour** — a single orange accent on layered charcoal:

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#131619` | page background |
| `--bg-alt` | `#171A1E` | alternating band (About, Contact) |
| `--surface` | `#1C2025` | cards |
| `--deep` | `#0E1114` | footer and input fields |
| `--accent` | `#FF6A1F` | **the only accent** — CTAs, icons, eyebrows, focus |

Everything not orange is greyscale. The brand gold lives in the logo itself
and is deliberately not repeated in the interface.

**Type** — Manrope throughout (400–800), tight tracking. JetBrains Mono does
exactly one job: the small section eyebrows. IBM Plex Sans Arabic swaps in for
Arabic and Kurdish.

**The orange full stop** — the only flourish on the page. `Crafted.` takes an
orange period, `Not Assembled.` a grey one. It is added by CSS
(`.hero__l1::after`), which is why the headline strings in `translations.js`
have no period of their own.

## Motion

Everything here is CSS transforms and opacity — no animation library, no GSAP,
nothing to install. That is why the page still has zero dependencies.

**The editor** in the hero types out code, holds it, fades, and moves to the next
file — cycling `index.html` → `style.css` → `app.js`, with the tab in its title
bar following along. It is decorative: the code is a good-looking sample, not the
real page source.

To change what it types, edit the `SNIPPETS` array near the bottom of
`js/main.js`. Each snippet is `{ file, lines }`, each line is a list of
`[text, token-class]` pairs, and the classes are styled in `style.css` §8b:

| Class | Colour | Used for |
|---|---|---|
| `tg` | orange | tags, CSS selectors, JS keywords |
| `at` | grey | attributes, CSS properties, variables |
| `st` | gold | strings and CSS values |
| `tx` | white | text content and identifiers |
| `pn` | dim grey | brackets and punctuation |
| `cm` | grey italic | comments |

Keep every snippet **five lines**, and add a matching `<span class="etab">` to
`#tabs` in `index.html` if you add a fourth file. The five-line height is
reserved in CSS so the page never shifts while typing.

It runs on `requestAnimationFrame`, not `setTimeout`, so a browser that opens the
page in a background tab pauses it rather than crawling through it a character a
second.

**Scroll-driven reveals.** Where the browser supports it (Chrome, Edge, Safari 26+)
sections are animated by CSS `animation-timeline: view()`. These run on the
compositor and *scrub* with the scroll rather than snapping on at a threshold,
which is what makes the page feel smooth rather than twitchy — and it costs no
JavaScript at all. `main.js` feature-detects it and adds `html.sda`; browsers
without it (Firefox today) fall back to the IntersectionObserver, so everyone
sees a reveal either way.

**A drifting glow** sits behind the hero — two large radial gradients moving on
30 and 38 second loops. Transform-only, so it is GPU work and costs nothing on
the main thread. It is deliberately faint; you should feel it rather than notice it.

**Film grain** is a fixed overlay at 3.5% opacity. It stops the big gradients
banding into visible steps on cheap screens and gives the dark surfaces depth.

**A cursor spotlight** follows the pointer across cards and project tiles — a
soft orange highlight that tracks where you are. One delegated `pointermove`
listener, throttled to one frame, writing two CSS custom properties. It is gated
behind `@media (hover:hover) and (pointer:fine)`, so phones never run the
JavaScript *or* paint the effect.

**A scroll progress line** sits on the header's bottom edge, and cards, buttons
and links lift on hover.

Everything above stops when the visitor has `prefers-reduced-motion` set: no
drift, no grain, no spotlight, and the editor renders its code complete rather
than typing.

## Sections

Home · About · Services · Process · FAQ · Contact, on one page.

The order follows a standard trust sequence: say what you do, show how you
work, answer the objections, then ask for the enquiry. Alignment alternates
on purpose — About and Process are left-aligned, the rest centred — because a
page where every section is centred reads flat.

**Services** carries two blocks: the three disciplines (design, development,
responsive), then **What we build** — portfolios, online stores, restaurant
menus, grocery shops, delivery and ordering, business sites, landing pages,
and an open "something else". That list also drives the Project type dropdown
in the brief form, so keep the two in step if you edit one
(`builds.b1`–`b8` and `form.type1`–`type9`).

**Process** answers "what happens if I message them" in four steps. **FAQ**
answers the five questions that actually stop people getting in touch: how
long, how much, do I own it, can you fix my current site, do you work abroad.
Both are worth keeping accurate — they are doing the job that testimonials
would do, honestly, until you have client work you can show.

The FAQ is built from native `<details>` elements, so it opens and closes with
no JavaScript at all and works for keyboard and screen-reader users for free.

## The examples

Every tile under **What we build** opens a full-screen example — a mockup of
what that kind of site looks like, in a browser frame, with your orange running
through it. Arrow buttons and the ← → keys move between all eight; Esc closes.

These are **drawings, not photographs**. Each one is inline SVG living in a
`<template id="ex0">` … `<template id="ex7">` at the bottom of `index.html`.
That means they are a couple of KB each instead of a couple of hundred, they
stay perfectly sharp on any screen or zoom level, and there are no image files
to upload or go missing. The colours come from CSS classes (`.mp` page,
`.ms` surface, `.mi` image block, `.ma` accent, `.mh` heading, `.mt` text line),
so restyling all eight at once is a handful of lines in `style.css`.

The captions are `show.d1`–`show.d8` in `translations.js`, and the modal
retitles itself live if a visitor changes language while it is open.

**Read this before you publish:** they are labelled *Example concept* on purpose.
They show what you can build, not work you have delivered. Once you have real
client sites, replace these with screenshots of those — real work always sells
harder than a mockup, and captioning a concept as a finished project is the kind
of thing a serious client will check.

## Files Cloudflare reads

`_headers` sets caching and a few security headers. Images cache for a month;
CSS and JS revalidate hourly and are deliberately **not** marked `immutable`,
because the filenames carry no version hash — a long cache would strand
returning visitors on an old design after you redeploy.

`robots.txt` allows everything. Add your sitemap line once the domain is live.

`index.html` also carries JSON-LD structured data describing the business
(name, email, phone, region, languages). Update it if the contact details
change — Google reads it.

## Accessibility

- All text meets WCAG AA contrast (4.5:1 minimum) on both the dark and light bands
- Every tap target is at least 44×44px
- Keyboard navigable throughout, with visible focus rings
- Respects `prefers-reduced-motion`
- If JavaScript fails to load, the full page still renders and reads

## Swapping the logo

Drop a replacement into `assets/` using the same filenames and it appears
everywhere. `logo-lockup.png` should be a wide, transparent PNG roughly
4.5:1 — it renders 38px tall in the header.
