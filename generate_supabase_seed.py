import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Load scraped_products.json
cache_file = "scraped_products.json"
products = []
if os.path.exists(cache_file):
    with open(cache_file, "r", encoding="utf-8") as f:
        products = json.load(f)

# Also add high quality curated catalog products
curated_products = [
    {
        "product_name": "Ultimate Notion Life OS",
        "creator_name": "ProductivityPro",
        "category": "Templates",
        "price": 49.00,
        "estimated_sales": 12450,
        "estimated_revenue": 610050.00,
        "avg_rating": 4.80,
        "total_reviews": 1420,
        "star_4_percent": 15,
        "star_3_percent": 3,
        "star_2_percent": 1,
        "opportunity_tags": ["Fast Growing", "Niche Leader"],
        "ai_gap_analysis": "High conversion on landing page. Users complain about lack of mobile layout customization in 3-star reviews.",
        "product_url": "https://gumroad.com/l/notion-life-os"
    },
    {
        "product_name": "SaaS UI Kit - React & Tailwind",
        "creator_name": "DesignMasters",
        "category": "Design Tools",
        "price": 129.00,
        "estimated_sales": 850,
        "estimated_revenue": 109650.00,
        "avg_rating": 4.90,
        "total_reviews": 310,
        "star_4_percent": 8,
        "star_3_percent": 2,
        "star_2_percent": 0,
        "opportunity_tags": ["High Revenue"],
        "ai_gap_analysis": "Excellent conversion rate but low top-of-funnel traffic. Opportunity to create a free 'lite' version or lead-magnet.",
        "product_url": "https://gumroad.com/l/saas-ui-kit"
    },
    {
        "product_name": "Minimalist Icon Pack",
        "creator_name": "Iconic Design",
        "category": "Assets",
        "price": 19.00,
        "estimated_sales": 5200,
        "estimated_revenue": 98800.00,
        "avg_rating": 3.40,
        "total_reviews": 450,
        "star_4_percent": 25,
        "star_3_percent": 35,
        "star_2_percent": 15,
        "opportunity_tags": ["High Sales / Low Rating"],
        "ai_gap_analysis": "High sales volume driven by bundle marketing, but heavy criticism on missing SVG source files in 2 and 3 star reviews.",
        "product_url": "https://gumroad.com/l/minimalist-icons"
    },
    {
        "product_name": "Mastering Next.js 15",
        "creator_name": "CodeGuru",
        "category": "Education",
        "price": 79.00,
        "estimated_sales": 2100,
        "estimated_revenue": 165900.00,
        "avg_rating": 4.70,
        "total_reviews": 890,
        "star_4_percent": 20,
        "star_3_percent": 3,
        "star_2_percent": 1,
        "opportunity_tags": ["Consistent"],
        "ai_gap_analysis": "Solid educational product. A major opportunity exists to add interactive quizzes or a community Discord, which users are currently building unofficially.",
        "product_url": "https://gumroad.com/l/mastering-nextjs"
    },
    {
        "product_name": "SEO Checklist 2026",
        "creator_name": "MarketingX",
        "category": "Business",
        "price": 29.00,
        "estimated_sales": 800,
        "estimated_revenue": 23200.00,
        "avg_rating": 4.60,
        "total_reviews": 150,
        "star_4_percent": 30,
        "star_3_percent": 3,
        "star_2_percent": 1,
        "opportunity_tags": ["Steady Growth"],
        "ai_gap_analysis": "Good foundational product. Opportunity to upsell automated SEO auditing tools or a subscription for monthly algorithm updates.",
        "product_url": "https://gumroad.com/l/seo-checklist"
    },
    {
        "product_name": "1000+ ChatGPT Prompts",
        "creator_name": "AI Whisperer",
        "category": "AI Tools",
        "price": 15.00,
        "estimated_sales": 18500,
        "estimated_revenue": 277500.00,
        "avg_rating": 3.90,
        "total_reviews": 2100,
        "star_4_percent": 30,
        "star_3_percent": 20,
        "star_2_percent": 10,
        "opportunity_tags": ["Volume Leader"],
        "ai_gap_analysis": "Massive volume but quality perception is dropping. Many users complain about repetitive prompts. A curated, higher-priced 'Pro' version could capture the disgruntled high-end market.",
        "product_url": "https://gumroad.com/l/chatgpt-prompts-pack"
    }
]

# Combine lists removing duplicates by product_url
all_products = list(products)
for cp in curated_products:
    if not any(p.get("product_url") == cp["product_url"] for p in all_products):
        all_products.append(cp)

sql_values = []
for p in all_products:
    tags = "ARRAY[" + ", ".join([f"'{t.replace("'", "''")}'" for t in p.get("opportunity_tags", [])]) + "]"
    name = p.get('product_name', '').replace("'", "''")
    creator = p.get('creator_name', '').replace("'", "''")
    cat = p.get('category', 'Business').replace("'", "''")
    price = p.get('price', 0.0)
    sales = p.get('estimated_sales', 0)
    revenue = p.get('estimated_revenue', 0.0)
    rating = p.get('avg_rating', 5.0)
    reviews = p.get('total_reviews', 0)
    star4 = p.get('star_4_percent', 0)
    star3 = p.get('star_3_percent', 0)
    star2 = p.get('star_2_percent', 0)
    insights = p.get('ai_gap_analysis', '').replace("'", "''")
    url = p.get('product_url', '').replace("'", "''")

    val = f"(\n    '{name}', '{creator}', '{cat}', {price}, {sales}, \n    {revenue}, {rating}, {reviews}, {star4}, \n    {star3}, {star2}, {tags}, \n    '{insights}', \n    '{url}'\n)"
    sql_values.append(val)

sql_content = f"""-- GumSearch Supabase Seed Script (Safe Upsert)
-- Run this in your Supabase SQL Editor to safely insert/update {len(all_products)} products!

INSERT INTO products (
    product_name, creator_name, category, price, estimated_sales, 
    estimated_revenue, avg_rating, total_reviews, star_4_percent, 
    star_3_percent, star_2_percent, opportunity_tags, ai_gap_analysis, product_url
) VALUES 
""" + ",\n".join(sql_values) + """
ON CONFLICT (product_url) DO UPDATE SET
    product_name = EXCLUDED.product_name,
    creator_name = EXCLUDED.creator_name,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    estimated_sales = EXCLUDED.estimated_sales,
    estimated_revenue = EXCLUDED.estimated_revenue,
    avg_rating = EXCLUDED.avg_rating,
    total_reviews = EXCLUDED.total_reviews,
    star_4_percent = EXCLUDED.star_4_percent,
    star_3_percent = EXCLUDED.star_3_percent,
    star_2_percent = EXCLUDED.star_2_percent,
    opportunity_tags = EXCLUDED.opportunity_tags,
    ai_gap_analysis = EXCLUDED.ai_gap_analysis;
"""

with open("seed_products.sql", "w", encoding="utf-8") as f:
    f.write(sql_content)

print(f"✅ Generated seed_products.sql with {len(all_products)} products!")
