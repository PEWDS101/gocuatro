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
    #
    # 2026-08-22: the dollar is BACK, shown beside the dinar rather than
    # instead of it. The dinar is the primary figure; USD is the second line.
    #
    # The PRICE_*_USD values below are DELIBERATELY NOT the exact conversion.
    # The owner chose round price points, so each dollar figure sits a little
    # under the dinar one at 1:1500:
    #     75,000  -> $49   (exact would be $50,  -1,500 IQD)
    #    105,000  -> $69   (exact would be $70,  -1,500 IQD)
    #    225,000  -> $149  (exact would be $150, -1,500 IQD)
    #    750,000  -> $499  (exact would be $500, -1,500 IQD)
    # Every gap runs in the customer's favour, which is the safe direction for
    # a rounding difference. Because of this the page must NEVER present the
    # dollar as a conversion of the dinar — no "=", no "≈". They are two
    # stated starting prices, each rounded for its own currency, and the note
    # strings say exactly that. If the owner ever wants them to reconcile,
    # change these to 50/70/150/500 and the claim becomes true again.
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

    # The second line under each dinar figure. Round price points, not a
    # conversion — see the note above before changing one without the other.
    "PRICE_MENU_USD": "69",
    "PRICE_PORTFOLIO_USD": "49",
    "PRICE_BUSINESS_USD": "149",
    "PRICE_BUSINESS_HI_USD": "499",

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
