import os
import sys
import json
import time
import html as html_lib
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import google.generativeai as genai
from supabase import create_client, Client

# Configure UTF-8 stdout for Windows console compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# ==========================================
# Configuration & API Keys
# ==========================================

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCQpkg7d5_3gW7ngQnW-g-Q4d1kIgPrs4E")
genai.configure(api_key=GEMINI_API_KEY)

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "https://gefzuacjuekhdlkfaned.supabase.co")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY", "sb_publishable_ISBbJtRBhQphzDMrzmbCmw_Lb2Ek2Zy")

supabase = None
try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception:
    pass

# Scaled High-Traffic Keyword Taxonomy Across 40+ Digital Product Niches
SEARCH_KEYWORDS = [
    "notion", "template", "ui kit", "saas", "ai", "prompt", "course", 
    "ebook", "design", "code", "react", "python", "marketing", 
    "business", "finance", "plugin", "3d", "audio", "fitness",
    "blender", "midjourney", "figma", "copywriting", "solopreneur",
    "newsletter", "automation", "no-code", "vibe-coding", "chatgpt",
    "crypto", "trading", "icons", "wallpapers", "canva", "preset",
    "lightroom", "framer", "webflow", "shopify", "sales", "funnel"
]

# ==========================================
# 1. Scaled Product Discovery Engine
# ==========================================

def discover_product_urls(target_count: int = 1500) -> list:
    """Automatically harvests product URLs from Gumroad discovery search across 40+ niches."""
    discovered = set()
    print(f"🔍 Starting Scaled Product Discovery (Target Goal: {target_count} URLs)...")
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"}
    
    for kw in SEARCH_KEYWORDS:
        if len(discovered) >= target_count:
            break
            
        print(f"  ➜ Discovering category: '{kw}'...")
        # Scrape 5 pagination offsets per keyword
        for offset in range(0, 180, 36):
            if len(discovered) >= target_count:
                break
                
            url = f"https://gumroad.com/discover?query={kw}&offset={offset}"
            try:
                res = requests.get(url, headers=headers, timeout=10)
                if res.status_code != 200:
                    continue
                    
                start_idx = res.text.find('data-page="')
                if start_idx == -1:
                    continue
                start = start_idx + len('data-page="')
                end = res.text.find('" style=', start)
                if end == -1:
                    end = res.text.find('">', start)
                    
                raw_json = html_lib.unescape(res.text[start:end])
                page_data = json.loads(raw_json)
                search_results = page_data.get("props", {}).get("search_results", {})
                products = search_results.get("products", [])
                
                for p in products:
                    permalink = p.get("permalink") or p.get("id")
                    long_url = p.get("long_url")
                    if long_url:
                        discovered.add(long_url)
                    elif permalink:
                        discovered.add(f"https://gumroad.com/l/{permalink}")
                        
                time.sleep(0.1) # Optimized fast rate limit
            except Exception as e:
                print(f"    ⚠️ Discovery error for '{kw}' offset {offset}: {e}")
                
    discovered_list = list(discovered)[:target_count]
    print(f"✨ Discovery completed! Collected {len(discovered_list)} unique product URLs.")
    return discovered_list

# ==========================================
# 2. Extractor & Gemini AI Gap Analysis
# ==========================================

def extract_product_data(html_content: str, url: str) -> dict:
    """Extracts product metrics + Gemini AI gap analysis."""
    extracted = None
    
    try:
        start_idx = html_content.find('data-page="')
        if start_idx != -1:
            start = start_idx + len('data-page="')
            end = html_content.find('" style=', start)
            if end == -1:
                end = html_content.find('">', start)
            
            raw_json = html_lib.unescape(html_content[start:end])
            page_data = json.loads(raw_json)
            prod = page_data.get("props", {}).get("product", {})
            
            if prod:
                price_cents = prod.get("price_cents") or 0
                price = price_cents / 100.0
                sales = prod.get("sales_count") or 0
                revenue = price * sales
                ratings = prod.get("ratings") or {}
                avg_rating = ratings.get("average") or 5.0
                total_reviews = ratings.get("count") or 0
                pcts = ratings.get("percentages") or [0, 0, 0, 0, 100]
                
                star_1 = pcts[0] if len(pcts) > 0 else 0
                star_2 = pcts[1] if len(pcts) > 1 else 0
                star_3 = pcts[2] if len(pcts) > 2 else 0
                star_4 = pcts[3] if len(pcts) > 3 else 0
                
                tags = []
                if revenue > 100000:
                    tags.append("High Revenue")
                if sales > 5000:
                    tags.append("Niche Leader")
                if avg_rating >= 4.8 and total_reviews > 100:
                    tags.append("Strong Social Proof")
                if price == 0:
                    tags.append("Free Lead Magnet")
                if not tags:
                    tags = ["Fast Growing"]

                extracted = {
                    "product_name": prod.get("name") or "Unknown Product",
                    "creator_name": prod.get("seller", {}).get("name") or "Unknown Creator",
                    "category": "Business" if "business" in (prod.get("name") or "").lower() else "Templates",
                    "price": price,
                    "estimated_sales": sales,
                    "estimated_revenue": revenue,
                    "avg_rating": avg_rating,
                    "total_reviews": total_reviews,
                    "star_4_percent": star_4,
                    "star_3_percent": star_3,
                    "star_2_percent": star_2,
                    "opportunity_tags": tags,
                    "ai_gap_analysis": prod.get("summary") or "Strong market presence with positive buyer reviews.",
                    "product_url": url
                }
    except Exception as e:
        pass

    # Enrich with Gemini AI gap analysis if available
    try:
        candidate_models = ["gemini-1.5-flash", "gemini-flash-latest", "gemini-2.0-flash"]
        prompt = """
Analyze this digital product. Return strictly JSON:
{
  "opportunity_tags": ["tag1", "tag2"],
  "ai_gap_analysis": "2 sentences highlighting user complaints or competitor opportunities."
}
"""
        context = json.dumps(extracted) if extracted else html_content[:8000]
        
        for model_name in candidate_models:
            try:
                model = genai.GenerativeModel(model_name)
                res = model.generate_content(f"{prompt}\n\nDATA:\n{context}", generation_config=genai.GenerationConfig(response_mime_type="application/json"))
                if res and res.text:
                    ai_data = json.loads(res.text)
                    if extracted:
                        if ai_data.get("opportunity_tags"):
                            extracted["opportunity_tags"] = ai_data["opportunity_tags"]
                        if ai_data.get("ai_gap_analysis"):
                            extracted["ai_gap_analysis"] = ai_data["ai_gap_analysis"]
                    else:
                        extracted = ai_data
                        extracted["product_url"] = url
                    break
            except Exception:
                continue
    except Exception:
        pass

    return extracted

def process_single_url(url: str, headers: dict) -> dict:
    """Worker function for multi-threaded scraping."""
    try:
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            return extract_product_data(res.text, url)
    except Exception:
        pass
    return None

def sync_local_data_file():
    """Syncs scraped_products.json into src/data.ts for dashboard fallback rendering."""
    try:
        cache_file = "scraped_products.json"
        if not os.path.exists(cache_file):
            return
        with open(cache_file, "r", encoding="utf-8") as f:
            items = json.load(f)

        mapped = []
        for idx, item in enumerate(items):
            mapped.append({
                'id': f'prod-{idx + 1}',
                'name': item.get('product_name', 'Gumroad Product'),
                'creator': item.get('creator_name', 'Gumroad Creator'),
                'category': item.get('category', 'Education'),
                'price': float(item.get('price', 0)),
                'sales': int(item.get('estimated_sales', 0)),
                'revenue': float(item.get('estimated_revenue', 0)),
                'rating': float(item.get('avg_rating', 5.0)),
                'reviewCount': int(item.get('total_reviews', 0)),
                'reviewBreakdown': {
                    'stars5': max(0, 100 - item.get('star_4_percent', 0) - item.get('star_3_percent', 0) - item.get('star_2_percent', 0)),
                    'stars4': item.get('star_4_percent', 0),
                    'stars3': item.get('star_3_percent', 0),
                    'stars2': item.get('star_2_percent', 0),
                    'stars1': 0
                },
                'tags': item.get('opportunity_tags', []),
                'aiInsights': item.get('ai_gap_analysis', ''),
                'productUrl': item.get('product_url', 'https://gumroad.com')
            })

        full_code = "import { Product } from './types';\n\nexport const MOCK_PRODUCTS: Product[] = " + json.dumps(mapped, indent=2) + ";\n"
        with open("src/data.ts", "w", encoding="utf-8") as f:
            f.write(full_code)
        print(f"🔄 Automatically synced {len(mapped)} products into src/data.ts!")
    except Exception as e:
        print(f"⚠️ Data sync error: {e}")

# ==========================================
# 3. High-Speed Parallel Scraping Pipeline
# ==========================================

def run_daily_pipeline(target_count: int = 1500, max_workers: int = 10):
    print(f"\n🚀 Launching Scaled Multi-Threaded Ingestion Pipeline (Goal: {target_count} products | Workers: {max_workers})...")
    
    # 1. Discover product URLs automatically
    urls = discover_product_urls(target_count)
    if not urls:
        print("⚠️ No URLs discovered.")
        return

    # 2. Parallel Extraction with ThreadPoolExecutor
    scraped_data = []
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"}
    
    print(f"⚡ Scraping {len(urls)} products in parallel using {max_workers} threads...")
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_url = {executor.submit(process_single_url, url, headers): url for url in urls}
        for future in as_completed(future_to_url):
            data = future.result()
            if data:
                scraped_data.append(data)
                # Save to Supabase if connected
                if supabase:
                    try:
                        supabase.table('products').upsert(data, on_conflict='product_url').execute()
                    except Exception:
                        pass
                print(f"  ✅ Extracted [{len(scraped_data)}/{len(urls)}]: {data.get('product_name')}")

    # 3. Save to local JSON cache
    cache_file = "scraped_products.json"
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(scraped_data, f, indent=2)
        
    sync_local_data_file()
    
    elapsed = round(time.time() - start_time, 2)
    print(f"\n✨ Ingestion Completed in {elapsed}s! Successfully scraped and indexed {len(scraped_data)} products.")

if __name__ == "__main__":
    target = 250 # Scaled batch target
    if len(sys.argv) > 1:
        try:
            target = int(sys.argv[1])
        except ValueError:
            pass
    run_daily_pipeline(target_count=target, max_workers=10)
