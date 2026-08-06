# CreatorFinder

*Unofficial tool to find and rank top creator storefronts on Gumroad by
keyword. Not affiliated with, endorsed by, or sponsored by Gumroad, Inc.
or Google. "Gumroad" is a trademark of Gumroad, Inc., referenced here
only to describe what this tool searches.*

Everything runs **inside the Chrome extension** — no backend, no
Node.js, no terminal. It fetches Google's search results for `"top
creator" site:gumroad.com <keyword>` directly from the browser, filters
down to real creator storefronts, ranks them, and shows just the
ranked store URLs.

```
gumroad-creator-finder/
├── extension/
│   ├── manifest.json
│   ├── index.html       full-tab UI
│   ├── styles.css
│   ├── app.js            search + ranking logic (all client-side)
│   ├── background.js     opens the app as a full tab, not a popup
│   └── icons/
└── README.md
```

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Click the CreatorFinder icon — it opens as a full browser tab.
   Clicking it again focuses that tab instead of opening a duplicate.
6. Type a keyword and search — that's it, no setup needed.

## How ranking works

There's no official "top creator" metric, so results are scored with a
transparent formula in `app.js` (`scoreCreators`):

- **Search position** — how early Google returned the result
- **Keyword match** — a bonus if the keyword appears in the store's
  username/subdomain

Adjust the weights in `scoreCreators()` to change what "top" means for
your use case.

## Notes & limitations

- **This scrapes Google's public search results page directly from the
  browser — there's no official Search API involved.** Google may
  occasionally rate-limit or block automated-looking requests
  (typically a `429` response or a CAPTCHA page); the extension caches
  each search for 5 minutes per tab session to reduce that. If it
  becomes a persistent problem, the official [Google Custom Search JSON
  API](https://developers.google.com/custom-search/v1/overview)
  is a more reliable (but rate-capped and not free-beyond-100-queries/
  day) alternative — swapping `searchGoogle()` in `app.js` for an API
  call is a small, isolated change.
- Only creator **storefronts** (`https://<username>.gumroad.com`) are
  returned — Gumroad's own help/blog/discover pages are filtered out.
- All data stays in the browser tab; nothing is sent to any server you
  don't control.
