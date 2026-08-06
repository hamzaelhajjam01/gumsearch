/**
 * CreatorFinder — all client-side, no backend required.
 * Fetches Google's search results directly from the extension
 * (host permission for google.com is declared in manifest.json),
 * extracts Gumroad creator storefront links, scores, and renders them.
 * Not affiliated with Google or Gumroad, Inc.
 */

const NON_CREATOR_SUBDOMAINS = new Set([
  "www", "app", "help", "blog", "discover", "gumroad", "docs", "status",
]);

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes, cleared when the tab closes
const cache = new Map();

const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const button = document.getElementById("search-button");
const resultsEl = document.getElementById("results");
const statusRow = document.getElementById("status-row");
const statusText = document.getElementById("status-text");
const template = document.getElementById("creator-card-template");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = input.value.trim();
  if (keyword) runSearch(keyword);
});

async function runSearch(keyword) {
  setLoading(true);
  showSkeletons();
  setStatus(`Searching gumroad.com for "${keyword}"…`, false);

  const cacheKey = keyword.toLowerCase();
  const cached = getCached(cacheKey);

  try {
    const payload = cached || (await performSearch(keyword));
    if (!cached) setCached(cacheKey, payload);

    renderResults(payload);

    if (payload.count === 0) {
      setStatus(`No store URLs found for "${keyword}".`, false);
    } else {
      setStatus(
        `${payload.count} store URL${payload.count === 1 ? "" : "s"} ranked` +
          (cached ? " · cached" : ""),
        false
      );
    }
  } catch (err) {
    renderError(err.message);
    setStatus(err.message || "Something went wrong.", true);
  } finally {
    setLoading(false);
  }
}

async function performSearch(keyword) {
  const html = await searchGoogle(keyword);
  const links = extractGumroadLinks(html);
  const creators = extractCreators(links).slice(0, 12);
  const ranked = scoreCreators(creators, keyword);
  return { keyword, count: ranked.length, creators: ranked };
}

// ---------------------------------------------------------------
// Google search + parsing (ported from the old backend, now local)
// ---------------------------------------------------------------
async function searchGoogle(keyword) {
  const params = new URLSearchParams({
    q: `"top creator" site:gumroad.com ${keyword}`,
    num: "20",
    hl: "en",
  });

  let res;
  try {
    res = await fetch(`https://www.google.com/search?${params.toString()}`, {
      headers: { "Accept-Language": "en-US,en;q=0.9" },
    });
  } catch {
    throw new Error("Couldn't reach Google. Check your internet connection and try again.");
  }

  if (!res.ok) {
    throw new Error(
      res.status === 429
        ? "Google is temporarily rate-limiting requests (too many searches too fast). Wait a bit and try again."
        : `Search request failed (${res.status}).`
    );
  }

  return res.text();
}

function extractGumroadLinks(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const found = [];

  doc.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    let real = href;
    if (href.startsWith("/url?")) {
      try {
        real = new URL(href, "https://www.google.com").searchParams.get("q") || href;
      } catch {
        return;
      }
    }
    if (/^https?:\/\/[a-z0-9-]+\.gumroad\.com/i.test(real)) {
      found.push(real);
    }
  });

  if (found.length === 0) {
    const matches = html.match(/https?:\/\/[a-z0-9-]+\.gumroad\.com[^\s"&<]*/gi) || [];
    found.push(...matches);
  }

  return found;
}

function extractCreators(links) {
  const seen = new Set();
  const creators = [];

  for (const link of links) {
    let hostname;
    try {
      hostname = new URL(link).hostname.toLowerCase();
    } catch {
      continue;
    }
    if (!hostname.endsWith(".gumroad.com")) continue;

    const username = hostname.replace(".gumroad.com", "");
    if (NON_CREATOR_SUBDOMAINS.has(username) || seen.has(username)) continue;

    seen.add(username);
    creators.push({
      username,
      storeUrl: `https://${username}.gumroad.com`,
      searchRank: creators.length + 1,
    });
  }

  return creators;
}

function scoreCreators(creators, keyword) {
  const kw = keyword.toLowerCase();

  const scored = creators.map((c) => {
    const positionScore = Math.max(0, 20 - c.searchRank);
    const keywordHits = c.username.includes(kw) ? 1 : 0;
    const score = positionScore * 2 + keywordHits * 5;
    return { ...c, score: Math.round(score * 10) / 10 };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((c, i) => ({ ...c, rank: i + 1 }));
}

// ---------------------------------------------------------------
// Cache
// ---------------------------------------------------------------
function getCached(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}
function setCached(key, data) {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
}

// ---------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------
function setLoading(isLoading) {
  button.disabled = isLoading;
  input.disabled = isLoading;
}

function setStatus(text, isError) {
  statusText.textContent = text;
  statusRow.hidden = !text;
  statusRow.classList.toggle("is-error", Boolean(isError));
}

function showSkeletons() {
  resultsEl.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const el = document.createElement("div");
    el.className = "skeleton-card";
    resultsEl.appendChild(el);
  }
}

function renderError(message) {
  resultsEl.innerHTML = "";
  const el = document.createElement("div");
  el.className = "empty-state";
  el.innerHTML = `
    <div class="empty-glyph"><span></span><span></span><span></span></div>
    <p class="empty-title">Search failed</p>
    <p class="empty-sub">${escapeHtml(message || "Something went wrong. Please try again.")}</p>
  `;
  resultsEl.appendChild(el);
}

function renderResults(data) {
  resultsEl.innerHTML = "";

  if (!data.creators || data.creators.length === 0) {
    const el = document.createElement("div");
    el.className = "empty-state";
    el.innerHTML = `
      <div class="empty-glyph"><span></span><span></span><span></span></div>
      <p class="empty-title">No store URLs found</p>
      <p class="empty-sub">Try a broader or differently spelled keyword.</p>
    `;
    resultsEl.appendChild(el);
    return;
  }

  for (const creator of data.creators) {
    resultsEl.appendChild(buildCard(creator));
  }
}

function buildCard(creator) {
  const node = template.content.cloneNode(true);

  node.querySelector(".stub-rank").textContent = String(creator.rank).padStart(2, "0");

  const storeUrl = node.querySelector(".store-url");
  storeUrl.textContent = creator.storeUrl.replace(/^https?:\/\//, "");
  storeUrl.href = creator.storeUrl;

  node.querySelector(".score-value").textContent = `${creator.score}`;

  const copyBtn = node.querySelector(".copy-btn");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(creator.storeUrl);
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 1200);
    } catch {
      /* clipboard permission denied — silently ignore */
    }
  });

  return node;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
