import os
import sys
import json
import requests
import google.generativeai as genai
from supabase import create_client, Client

# Configure UTF-8 stdout for Windows console compatibility
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')


# ==========================================
# Configuration & API Keys
# ==========================================

# 1. Gemini API Key Configuration
# Ensure you set the GEMINI_API_KEY environment variable before running
# export GEMINI_API_KEY="your_api_key_here"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


# 2. Supabase Configuration
SUPABASE_URL = "https://gefzuacjuskhdlkfaned.supabase.co"
SUPABASE_KEY = "sb_publishable_ISBbJtRBhQphzDMrzmbCmw_Lb2Ek2Zy"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ==========================================
# Gemini Prompt & Schema Definition
# ==========================================

EXTRACTION_PROMPT = """
You are an expert data extractor and market analyst.
Analyze the following raw HTML text from a Gumroad product page.
Extract the relevant product information and return it strictly as a JSON object matching the requested schema.

Guidelines for calculated/estimated fields:
- category: Assign it one of the following: "Templates", "Design Tools", "Assets", "Education", "Business", or "Other".
- estimated_sales: If the exact sales number is hidden, estimate it by assuming that approximately 3.5% of buyers leave a review (i.e. total_reviews / 0.035).
- estimated_revenue: Calculate as price * estimated_sales.
- star percentages (4, 3, 2): Estimate the breakdown of review stars (out of 100) based on context, or default to reasonable distributions if missing.
- opportunity_tags: Provide 1-3 tags based on the data (e.g., "High Sales / Low Rating", "Fast Growing", "Niche Leader").
- ai_gap_analysis: Provide exactly 2 concise sentences summarizing negative review complaints and competitor opportunities based on any clues in the text.

The JSON schema must exactly match these keys:
{
  "product_name": "string",
  "creator_name": "string",
  "category": "string",
  "price": "float",
  "estimated_sales": "integer",
  "estimated_revenue": "float",
  "avg_rating": "float",
  "total_reviews": "integer",
  "star_4_percent": "integer",
  "star_3_percent": "integer",
  "star_2_percent": "integer",
  "opportunity_tags": ["string"],
  "ai_gap_analysis": "string"
}
"""

def fetch_page_content(url: str) -> str:
    """Fetches the raw HTML content of the given URL."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.text

def extract_product_data(html_content: str, url: str) -> dict:
    """Extracts exact product metrics from Gumroad embedded JSON + Gemini AI for gap analysis."""
    import html as html_lib

    extracted = None
    
    # 1. Attempt exact ground-truth extraction from Gumroad's data-page attribute
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
                
                # star breakdown in percentages array: [1star, 2star, 3star, 4star, 5star]
                star_1 = pcts[0] if len(pcts) > 0 else 0
                star_2 = pcts[1] if len(pcts) > 1 else 0
                star_3 = pcts[2] if len(pcts) > 2 else 0
                star_4 = pcts[3] if len(pcts) > 3 else 0
                star_5 = pcts[4] if len(pcts) > 4 else 100
                
                extracted = {
                    "product_name": prod.get("name") or "Unknown Product",
                    "creator_name": prod.get("seller", {}).get("name") or "Unknown Creator",
                    "category": "Business" if "community" in (prod.get("summary") or "").lower() or "membership" in (prod.get("name") or "").lower() else "Education",
                    "price": price,
                    "estimated_sales": sales,
                    "estimated_revenue": revenue,
                    "avg_rating": avg_rating,
                    "total_reviews": total_reviews,
                    "star_4_percent": star_4,
                    "star_3_percent": star_3,
                    "star_2_percent": star_2,
                    "opportunity_tags": ["Niche Leader", "High Revenue"] if revenue > 100000 else ["Fast Growing"],
                    "ai_gap_analysis": prod.get("summary") or "Strong overall market presence with positive buyer reviews.",
                    "product_url": url
                }
    except Exception as e:
        print(f"  ⚠️ Warning: Direct HTML JSON parsing encountered issue: {e}")

    # 2. Enrich or fallback using Gemini AI
    try:
        candidate_models = ["gemini-flash-latest", "gemini-1.5-flash-latest", "gemini-2.0-flash"]
        prompt = f"""
You are an expert digital product analyst.
Based on this product title, seller, and overview, generate:
1. "opportunity_tags": array of 1-3 short tags (e.g. "High Revenue", "Niche Leader", "Strong Community", "High Sales / Low Rating").
2. "ai_gap_analysis": exactly 2 concise sentences highlighting user complaints or competitor opportunities.

Return strictly JSON matching:
{{
  "opportunity_tags": ["tag1", "tag2"],
  "ai_gap_analysis": "string"
}}
"""
        context = json.dumps(extracted) if extracted else html_content[:15000]
        
        for model_name in candidate_models:
            try:
                model = genai.GenerativeModel(model_name)
                res = model.generate_content(
                    f"{prompt}\n\nDATA:\n{context}",
                    generation_config=genai.GenerationConfig(response_mime_type="application/json")
                )
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
            except Exception as err:
                print(f"  ⚠️ Warning: Gemini AI model {model_name} failed: {err}")
                continue
    except Exception as e:
        print(f"  ⚠️ Warning: Gemini AI enrichment skipped: {e}")

    return extracted

def save_to_supabase(data: dict):
    """Upserts the structured data into the Supabase 'products' table and local cache."""
    saved_to_db = False
    try:
        response = supabase.table('products').upsert(data, on_conflict='product_url').execute()
        print(f"✅ Successfully saved {data.get('product_name')} to Supabase.")
        saved_to_db = True
    except Exception as e:
        print(f"⚠️ Could not save to Supabase directly: {e}")
    
    # Save local copy as backup/cache
    try:
        cache_file = "scraped_products.json"
        existing = []
        if os.path.exists(cache_file):
            with open(cache_file, "r", encoding="utf-8") as f:
                existing = json.load(f)
        # remove duplicate by product_url if exists
        existing = [item for item in existing if item.get("product_url") != data.get("product_url")]
        existing.append(data)
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
        print(f"📁 Local cache updated in '{cache_file}'.")
    except Exception as e:
        print(f"❌ Error saving local cache: {e}")

# ==========================================
# Main Execution Pipeline
# ==========================================

def main():
    sample_urls = [
        "https://dvassallo.gumroad.com/l/aws-good-parts",
        "https://dvassallo.gumroad.com/l/small-bets",
        "https://gumroad.com/l/notion-life-os",
        "https://gumroad.com/l/chatgpt-prompts"
    ]
    
    print("🚀 Starting Gumroad scraping pipeline...")
    
    extracted_products = []
    for url in sample_urls:
        print(f"\nProcessing: {url}")
        
        try:
            print("  1. Fetching page content...")
            html = fetch_page_content(url)
            
            print("  2. Extracting structured product data with Gemini AI...")
            structured_data = extract_product_data(html, url)
            
            if structured_data:
                print(f"  3. Extracted: '{structured_data.get('product_name')}' by {structured_data.get('creator_name')}")
                print("  4. Saving data...")
                save_to_supabase(structured_data)
                extracted_products.append(structured_data)
            else:
                print("  -> Extraction failed, skipping database upsert.")
                
        except Exception as e:
            print(f"❌ Pipeline error for {url}: {e}")
            
    print(f"\n✨ Scraper run finished. Scraped {len(extracted_products)} products successfully.")

if __name__ == "__main__":
    main()
