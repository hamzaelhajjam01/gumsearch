-- GumSearch Supabase Seed Script (Safe Upsert)
-- Run this in your Supabase SQL Editor to safely insert/update 24 products!

INSERT INTO products (
    product_name, creator_name, category, price, estimated_sales, 
    estimated_revenue, avg_rating, total_reviews, star_4_percent, 
    star_3_percent, star_2_percent, opportunity_tags, ai_gap_analysis, product_url
) VALUES 
(
    'The Good Parts of AWS', 'Daniel Vassallo', 'Education', 10.0, 15659, 
    156590.0, 4.7, 132, 8, 
    2, 1, ARRAY['High Revenue', 'Niche Leader', 'Strong Social Proof'], 
    'While the guide provides a solid pragmatic overview, some readers express a desire for deeper technical walkthroughs and hands-on code examples. Competitors can fill this gap by creating updated, interactive course modules that cover newer AWS services and complex real-world architectures.', 
    'https://dvassallo.gumroad.com/l/aws-good-parts'
),
(
    'Small Bets - Lifetime Membership', 'Daniel Vassallo', 'Business', 450.0, 7392, 
    3326400.0, 4.9, 189, 2, 
    0, 1, ARRAY['High Revenue', 'Niche Leader', 'Strong Community'], 
    'While the premium price point yields impressive lifetime revenue, price-sensitive creators may seek lower-cost or tiered subscription alternatives. Competitors can target this gap by offering affordable, execution-focused micro-courses paired with specialized peer groups.', 
    'https://dvassallo.gumroad.com/l/small-bets'
),
(
    'Notion Life OS - Ultimate Second Brain Life Operating System', 'Hashim | Notion4Management', 'Education', 49.0, 0, 
    0.0, 5.0, 3, 0, 
    0, 0, ARRAY['Premium Pricing', 'High Rating / Low Volume', 'Niche Product'], 
    'While the product holds perfect early ratings, comprehensive Notion operating systems often overwhelm buyers with overly complex setups and steep learning curves. Competitors can gain market share by offering modular, beginner-friendly versions paired with step-by-step video onboarding guides.', 
    'https://gumroad.com/l/notion-life-os'
),
(
    'Chat GPT Prompts for Content Writer', 'Akanksha', 'Education', 0.0, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['Free Lead Magnet', 'Competitive Niche'], 
    'As free generic ChatGPT prompt packs flood the market, buyers often struggle with vague or unrefined outputs. Competitors can differentiate by providing advanced, role-specific prompts paired with real-world output examples and custom tone-of-voice frameworks.', 
    'https://gumroad.com/l/chatgpt-prompts'
),
(
    'Notion Complete Bundle', 'Heyismail', 'Templates', 0.0, 110, 
    0.0, 5.0, 3, 0, 
    0, 0, ARRAY['Free Lead Magnet', 'Monetization Opportunity', 'Notion Template'], 
    'While the product successfully uses a free price point to drive downloads and earn top ratings, it fails to monetize the user base effectively. Competitors can capture market share by offering paid, feature-rich Notion setups paired with video tutorials and automated workflows.', 
    'https://gumroad.com/l/vgcmfi'
),
(
    'The UGC Pitching System ✨💸', 'Rylie Lane', 'Templates', 47.0, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['UGC Creator Tools', 'Cold Outreach Templates', 'High-Converting Pitch'], 
    'While high response rate claims attract aspiring creators, static pitch templates often lack customization options for specific industry niches. Competitors can differentiate by providing automated follow-up sequences and contract negotiation scripts alongside basic email pitch structures.', 
    'https://gumroad.com/l/xfovz'
),
(
    'The BCBA Career Transition Toolkit (CTT)', 'Mariah Padilla', 'Templates', 147.0, 20, 
    2940.0, 5.0, 0, 0, 
    0, 0, ARRAY['Niche Career Pivot', 'High Ticket Template'], 
    'While the toolkit addresses a highly specific career pivot for BCBAs, buyers often seek more than static templates, such as 1-on-1 resume reviews or interview coaching modules to justify the $147 price point. Competitors can capitalize on this by offering lower-priced entry points or including interactive elements like video walkthroughs and personalized transition roadmaps.', 
    'https://gumroad.com/l/qxxckx'
),
(
    '🌟Lifetime Membership – One Time Payment, Lifetime Access 💎 ', 'Hams AI Tech', 'Templates', 4999.99, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['High Ticket Price', 'Zero Sales Traction'], 
    'The exorbitant price tag of $4,999.99 combined with zero existing sales or social proof creates a massive trust barrier for potential buyers. Competitors can easily capture market share by offering flexible tier options, free sample templates, or transparent monthly subscriptions.', 
    'https://gumroad.com/l/jxydga'
),
(
    'Headquarters Notion Productivity Template', 'Productive Setups', 'Templates', 79.0, 0, 
    0.0, 5.0, 194, 1, 
    0, 0, ARRAY['High Price Point', 'Notion Ecosystem', 'Productivity Systems'], 
    'At a premium $79 price point, there is a strong opportunity to capture price-sensitive buyers with simplified, lower-cost Notion productivity alternatives. Additionally, creators can differentiate by offering specialized onboarding support or pre-built integrations that address the steep learning curve often associated with comprehensive Notion operating systems.', 
    'https://gumroad.com/l/hpqcg'
),
(
    'Notioly - 500+ Notion-style Illustrations', 'Mary Amato', 'Templates', 39.0, 0, 
    0.0, 5.0, 181, 0, 
    0, 0, ARRAY['Notion Ecosystem', 'Design Assets', 'High Demand'], 
    'While static illustration packs are popular, users often struggle with matching specific brand color palettes or finding animated variations for dynamic websites. Competitors can gain an edge by offering interactive color-customization tools, vector source files, or direct Notion integration plugins.', 
    'https://gumroad.com/l/dxsgg'
),
(
    'The Solopreneur Operating System', 'Huy Nguyen', 'Templates', 149.99, 269, 
    40347.310000000005, 5.0, 12, 0, 
    0, 0, ARRAY['High Ticket Template', 'Workflow Automation', 'Solopreneur Tools'], 
    'While the product commands a premium price point with high revenue, comprehensive operating systems often suffer from steep learning curves and rigid setup structures. Competitors can capture market share by offering a modular alternative featuring built-in AI automation hooks and streamlined onboarding support at a more accessible entry price.', 
    'https://gumroad.com/l/xhrdb'
),
(
    'Gamified Life OS: Solo Leveling', 'Kevechino', 'Templates', 0.0, 1834, 
    0.0, 5.0, 74, 3, 
    0, 0, ARRAY['Fast Growing'], 
    'Gamified Life OS', 
    'https://gumroad.com/l/mcztuh'
),
(
    'Storyteller OS', 'StoryFlint', 'Templates', 97.0, 0, 
    0.0, 4.8, 23, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'The ultimate Notion system for writers to organize their notes and ideas for characters, plot, world building, themes, and more.', 
    'https://gumroad.com/l/iuumxf'
),
(
    'Our Empire - Notion System', 'Our Empire', 'Templates', 44.99, 0, 
    0.0, 5.0, 3, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/flmgzy'
),
(
    'Knowledge Worker Kit and Private Community (BETA)', 'Sébastien Dubois', 'Templates', 249.99, 129, 
    32248.710000000003, 5.0, 7, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Lifetime access to the private community, the guide, the templates, and events', 
    'https://gumroad.com/l/pyjrr'
),
(
    '365 Substack Notes Templates', 'Write • Build • Scale', 'Templates', 47.0, 0, 
    0.0, 4.9, 16, 6, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/ficfih'
),
(
    'The Complete Cavalry Guide', 'Heyalisa Motion', 'Templates', 25.0, 820, 
    20500.0, 4.9, 20, 0, 
    5, 0, ARRAY['Niche Motion Design', 'High Revenue Margin', 'Fast Growing'], 
    'While ratings are overwhelmingly high, the slight presence of mid-tier reviews suggests a need for deeper step-by-step guidance for absolute beginners and more frequent content updates for newer software versions. Competitors have an opportunity to offer modular project files combined with advanced procedural animation workflows to capture underserved creators.', 
    'https://gumroad.com/l/dybmn'
),
(
    'The VB Toolkit ($50 off)', 'LC Media Studio - by Mat Aleixo', 'Templates', 79.0, 30, 
    2370.0, 5.0, 0, 0, 
    0, 0, ARRAY['Notion Template', 'High-Ticket Digital Product', 'Workflow Automation'], 
    'While sold at a premium price point of $79, reliance on static Notion templates creates an opportunity for competitors to offer interactive, dedicated micro-SaaS tools or lower-cost starter alternatives. Additionally, incorporating native automation scripts and video walk-throughs could resolve common onboarding friction points that static template buyers often face.', 
    'https://gumroad.com/l/tvhvs'
),
(
    'AI Voice Assistant - Complete Setup & Build Guide (Build Your Own Jarvis)', 'DHAIBuilds', 'Templates', 17.0, 0, 
    0.0, 5.0, 1, 0, 
    0, 0, ARRAY['AI Voice Assistants', 'No-Code Automation'], 
    'While beginner-friendly guides attract non-technical users, many buyers encounter issues with fast-changing API dependencies and limited post-setup customization. Competitors can capture market share by offering modular, auto-updating templates alongside dedicated troubleshooting support for custom voice integrations.', 
    'https://gumroad.com/l/fhnnc'
),
(
    'SaaS UI Kit - React & Tailwind', 'DesignMasters', 'Design Tools', 129.0, 850, 
    109650.0, 4.9, 310, 8, 
    2, 0, ARRAY['High Revenue'], 
    'Excellent conversion rate but low top-of-funnel traffic. Opportunity to create a free ''lite'' version or lead-magnet.', 
    'https://gumroad.com/l/saas-ui-kit'
),
(
    'Minimalist Icon Pack', 'Iconic Design', 'Assets', 19.0, 5200, 
    98800.0, 3.4, 450, 25, 
    35, 15, ARRAY['High Sales / Low Rating'], 
    'High sales volume driven by bundle marketing, but heavy criticism on missing SVG source files in 2 and 3 star reviews.', 
    'https://gumroad.com/l/minimalist-icons'
),
(
    'Mastering Next.js 15', 'CodeGuru', 'Education', 79.0, 2100, 
    165900.0, 4.7, 890, 20, 
    3, 1, ARRAY['Consistent'], 
    'Solid educational product. A major opportunity exists to add interactive quizzes or a community Discord, which users are currently building unofficially.', 
    'https://gumroad.com/l/mastering-nextjs'
),
(
    'SEO Checklist 2026', 'MarketingX', 'Business', 29.0, 800, 
    23200.0, 4.6, 150, 30, 
    3, 1, ARRAY['Steady Growth'], 
    'Good foundational product. Opportunity to upsell automated SEO auditing tools or a subscription for monthly algorithm updates.', 
    'https://gumroad.com/l/seo-checklist'
),
(
    '1000+ ChatGPT Prompts', 'AI Whisperer', 'AI Tools', 15.0, 18500, 
    277500.0, 3.9, 2100, 30, 
    20, 10, ARRAY['Volume Leader'], 
    'Massive volume but quality perception is dropping. Many users complain about repetitive prompts. A curated, higher-priced ''Pro'' version could capture the disgruntled high-end market.', 
    'https://gumroad.com/l/chatgpt-prompts-pack'
)
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
