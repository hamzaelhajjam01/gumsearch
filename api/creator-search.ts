import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';
import http from 'http';

function aggregateSellersFromHtml(html: string): any[] {
  try {
    const match = html.match(/data-page="([^"]+)"/) || html.match(/data-page='([^']+)'/);
    if (!match) return [];
    const rawJson = match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const data = JSON.parse(rawJson);
    const prods = data?.props?.search_results?.products || [];
    if (!Array.isArray(prods) || prods.length === 0) return [];

    const sellersMap = new Map<string, any>();
    for (const p of prods) {
      const seller = p.seller || p.user || {};
      const sName = seller.name || 'Unknown Creator';
      const sUrlRaw = seller.profile_url || p.url || '';
      const sUrl = sUrlRaw.split('?')[0].replace(/\/$/, '');
      const sAvatar = seller.avatar_url || '';
      const sVerified = !!seller.is_verified;

      if (!sUrl || !sUrl.endsWith('.gumroad.com')) continue;
      
      let sub = '';
      try { sub = new URL(sUrl).hostname.split('.')[0].toLowerCase(); } catch { continue; }
      if (['www', 'app', 'help', 'blog', 'discover', 'gumroad', 'docs', 'status', 'api', 'support', 'public-files', 'login', 'signup', 'checkout'].includes(sub)) continue;

      if (!sellersMap.has(sUrl)) {
        sellersMap.set(sUrl, {
          username: sub,
          creatorName: sName,
          storeUrl: sUrl,
          avatarUrl: sAvatar,
          isVerified: sVerified,
          products: [],
          totalReviews: 0,
          maxPrice: 0.0,
        });
      }

      const entry = sellersMap.get(sUrl)!;
      const pName = p.name || p.title || 'Product';
      const price = typeof p.price_cents === 'number' ? p.price_cents / 100.0 : (typeof p.price === 'number' ? p.price : 0.0);
      const ratings = p.ratings || {};
      const count = typeof ratings.count === 'number' ? ratings.count : 0;
      const avg = typeof ratings.average === 'number' ? ratings.average : 0.0;

      entry.products.push({
        title: pName,
        price: Math.round(price * 100) / 100,
        reviews: count,
        rating: Math.round(avg * 10) / 10,
        url: p.url || sUrl
      });
      entry.totalReviews += count;
      if (price > entry.maxPrice) entry.maxPrice = Math.round(price * 100) / 100;
    }

    const sorted = Array.from(sellersMap.values()).sort((a, b) => {
      if (b.totalReviews !== a.totalReviews) return b.totalReviews - a.totalReviews;
      if (b.products.length !== a.products.length) return b.products.length - a.products.length;
      return b.maxPrice - a.maxPrice;
    });

    return sorted.map((s, idx) => ({
      username: s.username,
      creatorName: s.creatorName,
      storeUrl: s.storeUrl,
      rank: idx + 1,
      score: Math.round((Math.max(10, 50 - idx * 2) + Math.min(50, s.totalReviews * 0.1)) * 10) / 10,
      avatarUrl: s.avatarUrl,
      isVerified: s.isVerified,
      totalReviews: s.totalReviews,
      productCount: s.products.length,
      maxPrice: s.maxPrice,
      topOfferings: s.products.slice(0, 3).map((p: any) => ({ title: p.title, price: p.price, url: p.url }))
    }));
  } catch {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const keyword = (req.query.q as string) || '';
  if (!keyword) {
    res.status(400).json({ error: 'Keyword required' });
    return;
  }

  const fetchUrl = (targetUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const client = targetUrl.startsWith('https') ? https : http;
      const request = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(data));
      });
      request.on('error', reject);
      request.setTimeout(4500, () => { request.destroy(); reject(new Error('Timeout')); });
    });
  };

  try {
    const cleanKw = keyword.trim().toLowerCase();
    const gumroadDiscoverUrl = `https://gumroad.com/discover?query=${encodeURIComponent(cleanKw)}`;
    const qGoogle = `"top creator" site:gumroad.com ${cleanKw}`;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(qGoogle)}&num=30&hl=en`;

    const htmlResults = await Promise.any([
      fetchUrl(gumroadDiscoverUrl),
      fetchUrl(googleUrl)
    ]);

    const aggregatedSellers = aggregateSellersFromHtml(htmlResults);

    res.status(200).json({ 
      html: htmlResults,
      creators: aggregatedSellers.length > 0 ? aggregatedSellers : undefined,
      source: aggregatedSellers.length > 0 ? 'Gumroad Sales Power Analytics (Zero-CORS)' : 'Live Marketplace Engine (Zero-CORS)'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch search results' });
  }
}
