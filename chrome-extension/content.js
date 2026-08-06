/**
 * GumSearch Chrome Extension Content Script
 * Dynamic Real-Time Gumroad Page Scraper & Sales Intelligence
 * Backlinks to https://gumsearch.com
 */

(function () {
  if (document.getElementById('gumsearch-extension-bar')) return;

  function extractPageMetrics() {
    let title = document.title ? document.title.replace(' | Gumroad', '') : 'Gumroad Product';
    const h1 = document.querySelector('h1, [class*="product-title"], [class*="Header"]');
    if (h1 && h1.innerText) title = h1.innerText.trim();

    let reviewsCount = 0;
    let ratingValue = 5.0;
    let priceVal = 0;
    let isRealData = false;

    // --- STRATEGY 1: Parse JSON-LD Schema (Highest Precision) ---
    try {
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      jsonLdScripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          const target = data['@type'] === 'Product' ? data : (data['@graph']?.find(item => item['@type'] === 'Product'));
          if (target) {
            if (target.aggregateRating) {
              if (target.aggregateRating.reviewCount) {
                reviewsCount = parseInt(target.aggregateRating.reviewCount, 10);
                isRealData = true;
              }
              if (target.aggregateRating.ratingValue) {
                ratingValue = parseFloat(target.aggregateRating.ratingValue);
              }
            }
            if (target.offers) {
              const offer = Array.isArray(target.offers) ? target.offers[0] : target.offers;
              if (offer && offer.price) {
                priceVal = parseFloat(offer.price);
                isRealData = true;
              }
            }
          }
        } catch {
          // Continue to next script
        }
      });
    } catch {
      // Continue to Strategy 2
    }

    // --- STRATEGY 2: Meta Tags ---
    if (!priceVal) {
      const priceMeta = document.querySelector('meta[property="product:price:amount"], meta[property="og:price:amount"]');
      if (priceMeta && priceMeta.content) {
        priceVal = parseFloat(priceMeta.content);
        isRealData = true;
      }
    }

    // --- STRATEGY 3: DOM Selectors & Pattern Matching ---
    if (!reviewsCount) {
      // Scan rating elements
      const ratingEls = document.querySelectorAll('[class*="rating"], [class*="stars"], [class*="review"], [data-component-name*="Rating"]');
      for (const el of ratingEls) {
        const text = el.innerText || '';
        const match = text.match(/\((\d+)\)/) || text.match(/(\d+)\s+(?:ratings?|reviews?)/i);
        if (match) {
          reviewsCount = parseInt(match[1], 10);
          isRealData = true;
          break;
        }
      }
    }

    if (!priceVal) {
      // Scan price elements
      const priceEls = document.querySelectorAll('.price, [class*="price"], [class*="amount"], button[type="submit"]');
      for (const el of priceEls) {
        const text = el.innerText || '';
        const match = text.match(/\$([0-9,]+(?:\.[0-9]{2})?)/) || text.match(/([0-9,]+(?:\.[0-9]{2})?)\s*\$/);
        if (match) {
          const parsed = parseFloat(match[1].replace(',', ''));
          if (parsed > 0 && parsed < 10000) {
            priceVal = parsed;
            isRealData = true;
            break;
          }
        }
      }
    }

    // --- STRATEGY 4: Body Text Regex (Sales/Buyers Mentioned) ---
    let directSales = 0;
    const bodyText = document.body ? document.body.innerText : '';
    const salesMatch = bodyText.match(/(\d+[\d,]*)\s+(?:sales|buyers|purchased|customers|creators bought)/i);
    if (salesMatch) {
      directSales = parseInt(salesMatch[1].replace(/,/g, ''), 10);
    }

    // --- REAL-TIME ANALYTICS ALGORITHM ---
    const estSales = directSales > 0 ? directSales : (reviewsCount > 0 ? Math.round(reviewsCount * 8.5) : 0);
    const estRevenue = estSales * priceVal;
    
    // Calculate dynamic Sales Power Score (0-100)
    let salesPower = 0;
    if (isRealData || estSales > 0 || priceVal > 0) {
      const reviewScore = Math.min(40, reviewsCount * 0.4);
      const salesScore = Math.min(40, estSales * 0.05);
      const priceScore = Math.min(20, priceVal * 0.2);
      salesPower = Math.min(99, Math.max(15, Math.round(reviewScore + salesScore + priceScore)));
    }

    return {
      title,
      reviewsCount,
      ratingValue: ratingValue.toFixed(1),
      estSales,
      estRevenue,
      salesPower,
      priceVal,
      isRealData
    };
  }

  function renderWidget(widget, metrics) {
    const revenueDisplay = metrics.estRevenue > 0 ? `$${metrics.estRevenue.toLocaleString()}` : (metrics.priceVal > 0 ? `$${metrics.priceVal}` : 'N/A');
    const volumeDisplay = metrics.estSales > 0 ? `${metrics.estSales.toLocaleString()} sales` : 'N/A';
    const reviewsDisplay = metrics.reviewsCount > 0 ? `${metrics.reviewsCount} verified` : '0 verified';
    const powerDisplay = metrics.salesPower > 0 ? `${metrics.salesPower}/100` : 'N/A';

    const bodyContent = widget.querySelector('#gumsearch-body-content');
    if (!bodyContent) return;

    bodyContent.innerHTML = `
      <div class="gumsearch-metrics-grid">
        <div class="gumsearch-metric-card">
          <div class="gumsearch-metric-label">Sales Power</div>
          <div class="gumsearch-metric-value pink">${powerDisplay}</div>
        </div>
        <div class="gumsearch-metric-card">
          <div class="gumsearch-metric-label">Est. Revenue</div>
          <div class="gumsearch-metric-value emerald">${revenueDisplay}</div>
        </div>
        <div class="gumsearch-metric-card">
          <div class="gumsearch-metric-label">Est. Volume</div>
          <div class="gumsearch-metric-value amber">${volumeDisplay}</div>
        </div>
        <div class="gumsearch-metric-card">
          <div class="gumsearch-metric-label">Reviews</div>
          <div class="gumsearch-metric-value">${reviewsDisplay}</div>
        </div>
      </div>

      <a href="https://gumsearch.com/dashboard" target="_blank" class="gumsearch-cta-btn">
        <span>Explore 100,000+ Products on GumSearch →</span>
      </a>

      <div class="gumsearch-backlink-footer">
        Powered by <a href="https://gumsearch.com" target="_blank">GumSearch.com</a> Live Analytics
      </div>
    `;
  }

  function injectWidget() {
    let widget = document.getElementById('gumsearch-extension-bar');
    if (!widget) {
      widget = document.createElement('div');
      widget.id = 'gumsearch-extension-bar';

      widget.innerHTML = `
        <div class="gumsearch-header">
          <div class="gumsearch-brand">
            <div class="gumsearch-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <span>GumSearch Intelligence</span>
          </div>
          <button class="gumsearch-close-btn" id="gumsearch-minimize-btn" title="Minimize">—</button>
        </div>
        <div class="gumsearch-body" id="gumsearch-body-content"></div>
      `;

      document.body.appendChild(widget);

      // Minimize toggle
      let isMinimized = false;
      const minBtn = widget.querySelector('#gumsearch-minimize-btn');
      const bodyContent = widget.querySelector('#gumsearch-body-content');

      widget.addEventListener('click', () => {
        if (isMinimized) {
          isMinimized = false;
          widget.classList.remove('minimized');
          bodyContent.style.display = 'block';
        }
      });

      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isMinimized = !isMinimized;
        if (isMinimized) {
          widget.classList.add('minimized');
          bodyContent.style.display = 'none';
        } else {
          widget.classList.remove('minimized');
          bodyContent.style.display = 'block';
        }
      });
    }

    const metrics = extractPageMetrics();
    renderWidget(widget, metrics);
  }

  // Initial load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(injectWidget, 600);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(injectWidget, 600));
  }

  // --- DYNAMIC RE-SCRAPING ON SPA NAVIGATION / DOM CHANGES ---
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(injectWidget, 500);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
