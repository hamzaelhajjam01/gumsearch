import os
import sys
import json
import time
import html as html_lib
import requests
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

SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "https://gefzuacjuskhdlkfaned.supabase.co")
SUPABASE_KEY = os.environ.get("VITE_SUPABASE_ANON_KEY", "sb_publishable_ISBbJtRBhQphzDMrzmbCmw_Lb2Ek2Zy")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

SEARCH_KEYWORDS = [
    "notion", "template", "ui kit", "saas", "ai", "prompt", "course", 
    "ebook", "design", "code", "react", "python", "marketing", 
    "business", "finance", "plugin", "3d", "audio", "fitness"
]

# ==========================================
# 1. Automated Product Discovery Engine
# ==========================================

def discover_product_urls(target_count: int = 1500) -> list:
    """Automatically harvests product URLs from Gumroad discovery search and categories."""
    discovered = set()
    print(f"🔍 Starting Automated Product Discovery (Target: {target_count} URLs)...")
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"}
    
    for kw in SEARCH_KEYWORDS:
        if len(discovered) >= target_count:
            break
            
        print(f"  ➜ Discovering keyword: '{kw}'...")
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
                        
                time.sleep(0.3) # respectful rate limiting
            except Exception as e:
                print(f"    ⚠️ Discovery error for {kw} offset {offset}: {e}")
                
    discovered_list = list(discovered)[:target_count]
    print(f"✨ Discovery completed! Collected {len(discovered_list)} unique product URLs.")
    return discovered_list

# ==========================================
# 2. Extractor & Gemini AI Teardown
# ==========================================

def extract_product_data(html_content: str, url: str) -> dict:
    """Extracts ground-truth product payload + Gemini AI analysis."""
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
                    "opportunity_tags": ["High Revenue"] if revenue > 100000 else ["Fast Growing"],
                    "ai_gap_analysis": prod.get("summary") or "Strong market presence with positive buyer reviews.",
                    "product_url": url
                }
    except Exception as e:
        print(f"  ⚠️ Warning: Direct HTML parsing error: {e}")

    # Enrich with Gemini AI gap analysis
    try:
        candidate_models = ["gemini-flash-latest", "gemini-1.5-flash-latest", "gemini-2.0-flash"]
        prompt = """
Analyze this product. Return strictly JSON:
{
  "opportunity_tags": ["tag1", "tag2"],
  "ai_gap_analysis": "2 sentences highlighting user complaints or competitor opportunities."
}
"""
        context = json.dumps(extracted) if extracted else html_content[:10000]
        
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

def save_to_supabase(data: dict):
    """Upserts extracted data into Supabase and updates local cache."""
    try:
        supabase.table('products').upsert(data, on_conflict='product_url').execute()
        print(f"  ✅ Saved '{data.get('product_name')}' to Supabase.")
    except Exception:
        pass
        
    try:
        cache_file = "scraped_products.json"
        existing = []
        if os.path.exists(cache_file):
            with open(cache_file, "r", encoding="utf-8") as f:
                existing = json.load(f)
        existing = [item for item in existing if item.get("product_url") != data.get("product_url")]
        existing.append(data)
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
    except Exception as e:
        print(f"  ❌ Cache error: {e}")

# ==========================================
# 3. Main Daily Automation Pipeline
# ==========================================

def run_daily_pipeline(target_count: int = 1500):
    print(f"\n🚀 Launching GumSearch Daily Automated Ingestion Pipeline (Goal: {target_count} products)...")
    
    # 1. Discover product URLs automatically
    urls = discover_product_urls(target_count)
    
    # 2. Extract and process each product
    scraped_count = 0
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36"}
    
    for idx, url in enumerate(urls, 1):
        try:
            print(f"[{idx}/{len(urls)}] Processing: {url}")
            res = requests.get(url, headers=headers, timeout=10)
            if res.status_code != 200:
                continue
                
            data = extract_product_data(res.text, url)
            if data:
                save_to_supabase(data)
                scraped_count += 1
            time.sleep(0.2)
        except Exception as e:
            print(f"  ❌ Pipeline error for {url}: {e}")
            
    print(f"\n✨ Daily Ingestion Completed! Automatically discovered and scraped {scraped_count} products.")

if __name__ == "__main__":
    target = 100 # default batch target for CLI run
    if len(sys.argv) > 1:
        try:
            target = int(sys.argv[1])
        except ValueError:
            pass
    run_daily_pipeline(target_count=target)
