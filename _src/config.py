"""Business facts — the ONE place they are written down.

Every phone number, price, email address and turnaround figure on the site is
substituted from here at build time. Change a value, run `python _src/build.py`,
and it updates in all six pages, in all three languages, and in js/config.js
(which build.py regenerates so the JavaScript uses the same values).

    python _src/build.py

Two rules that keep this honest:

  - Words are NOT here. "Starting at", "Most menus … are completed in", every
    label and sentence lives in js/translations.js so it can be translated.
    Only the values live here — the numeral, the address, the URL. That is why
    a price in the markup reads
        <span data-i18n="price.from">Starting at</span> <span>${{PRICE_MENU}}</span>
    and never a whole translated sentence with a number baked into it.

  - Anything not confirmed by the owner is an EMPTY STRING, and the templates
    are written so an empty value renders nothing rather than a broken link.
    Do not put a guess here.
"""

BUSINESS = {
    # ── contact ──────────────────────────────────────────────────────────
    # To move off Gmail later: change EMAIL to the new address, run build.py.
    # That single edit updates the contact card, the footer icon, the brief
    # form's mailto fallback, the FAQ and the JSON-LD. Nothing else to touch.
    "EMAIL": "GoCuatro4@gmail.com",

    "WA_NUMBER": "9647750775533",        # digits only, international, for wa.me
    "PHONE_DISPLAY": "0775 077 5533",    # as a local reader expects to see it
    "TEL": "07750775533",                # for tel:
    "TELEGRAM": "https://t.me/+9647750775533",

    # ── social ───────────────────────────────────────────────────────────
    # Displayed only when non-empty. THREADS is a real URL already used in the
    # site's JSON-LD. TIKTOK is blank because no TikTok URL exists anywhere in
    # this project — put the real one here and the icon appears by itself.
    "INSTAGRAM": "https://instagram.com/gocuatro",
    "INSTAGRAM_HANDLE": "@gocuatro",
    "FACEBOOK": "https://www.facebook.com/profile.php?id=61593175900925",
    "THREADS": "https://www.threads.com/@gocuatro",
    "TIKTOK": "",

    # ── site ─────────────────────────────────────────────────────────────
    "SITE": "https://gocuatro.com/",     # trailing slash; canonical/og:url base

    # ── prices, in IRAQI DINARS, as STARTING points ──────────────────────
    # RAW INTEGERS, no separators. build.py derives the grouped display form
    # ({{PRICE_MENU_FMT}} -> "105,000") for the page, and leaves the raw value
    # for the JSON-LD, where schema.org requires a bare number.
    #
    # Priced in USD until 2026-08-21, when the owner moved to dinars at the
    # rate he gave: $100 = 150,000 IQD, i.e. 1 USD = 1,500 IQD.
    #     portfolio  $50  ->   75,000
    #     menu       $70  ->  105,000
    #     business  $150  ->  225,000
    #     upper end $500  ->  750,000
    # The USD figures are kept here only as the audit trail for those four
    # numbers. Nothing on the site shows a dollar any more.
    #
    # Every one of these is rendered after a "Starting at" label.
    #
    # FIVE prose strings also name a figure or a currency in words:
    # meta.description, meta.services.description, faq.a1, price.note and
    # home.priceNote in js/translations.js — plus price.cur, which is the
    # currency label itself. They are the only places a price is written in
    # words; change them here and there together, or check_i18n and probe.js
    # will not catch the drift.
    "PRICE_MENU": "105000",
    "PRICE_PORTFOLIO": "75000",
    "PRICE_BUSINESS": "225000",
    "PRICE_BUSINESS_HI": "750000",       # the common upper end, not a ceiling
    "PRICE_CURRENCY": "IQD",             # ISO 4217, for the JSON-LD only

    # ── turnaround ───────────────────────────────────────────────────────
    # Always stated as starting AFTER the content and details arrive. The
    # wording that carries that condition is in translations.js; these are
    # only the numerals.
    "DAYS_MIN": "2",
    "DAYS_MAX": "4",
}

# Values that may legitimately be empty. Everything else must be filled in, and
# build.py stops with an error if it is not — a blank phone number should never
# reach a built page unnoticed.
MAY_BE_EMPTY = {"TIKTOK"}
