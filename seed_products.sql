-- GumSearch Supabase Seed Script & RLS Fix
-- Step 1: Disable RLS so public queries and scraper inserts work smoothly
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Step 2: Safely insert/update all 30 harvested products!
INSERT INTO products (
    product_name, creator_name, category, price, estimated_sales, 
    estimated_revenue, avg_rating, total_reviews, star_4_percent, 
    star_3_percent, star_2_percent, opportunity_tags, ai_gap_analysis, product_url
) VALUES 
(
    'The Complete Cavalry Guide', 'Heyalisa Motion', 'Templates', 25.0, 824, 
    20600.0, 4.9, 20, 0, 
    5, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/dybmn'
),
(
    'The VB Toolkit ($50 off)', 'LC Media Studio - by Mat Aleixo', 'Templates', 79.0, 30, 
    2370.0, 5.0, 0, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Immediately after purchasing, you’ll receive a PDF containing a link to the Notion template. From there, you can duplicate the toolkit into your own Notion workspace and start using it right away.  It’s quick, seamless, and designed to get you up and running with minimal effort.', 
    'https://gumroad.com/l/tvhvs'
),
(
    'The Art of AI 2.0︱All in One', 'Ziks ⎸ Your AI Guy', 'Templates', 500.0, 0, 
    0.0, 5.0, 25, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/cbate'
),
(
    'Your ADHD Mynd - Notion Template (Recently Updated!)', 'Braelyn | Mynd for ADHD', 'Templates', 45.0, 607, 
    27315.0, 4.9, 7, 14, 
    0, 0, ARRAY['Fast Growing'], 
    'A beautiful multi-page Notion dashboard to manage all areas of your life.', 
    'https://gumroad.com/l/dvspii'
),
(
    'Smart Finance', 'Jahaziel Guerra', 'Templates', 8.99, 0, 
    0.0, 4.9, 34, 6, 
    3, 0, ARRAY['Fast Growing'], 
    'No solo administres tu dinero — domínalo. Empieza a usar Smart Finance y transforma tu vida financiera hoy mismo.', 
    'https://gumroad.com/l/xrfsb'
),
(
    'AI Voice Assistant - Complete Setup & Build Guide (Build Your Own Jarvis)', 'DHAIBuilds', 'Templates', 17.0, 0, 
    0.0, 5.0, 1, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Build your own AI voice assistant from scratch - no coding experience needed!', 
    'https://gumroad.com/l/fhnnc'
),
(
    'Second Brain Template', 'Heyismail', 'Templates', 0.0, 27690, 
    0.0, 4.9, 373, 2, 
    2, 0, ARRAY['Niche Leader', 'Strong Social Proof', 'Free Lead Magnet'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/piboc'
),
(
    '365 Substack Notes Templates', 'Write • Build • Scale', 'Templates', 47.0, 0, 
    0.0, 4.9, 16, 6, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/ficfih'
),
(
    'Knowii Knowledge System: Tools + Courses + Community', 'Sébastien Dubois', 'Templates', 0.0, 0, 
    0.0, 5.0, 1, 0, 
    0, 0, ARRAY['Free Lead Magnet'], 
    'Exclusive Access to the Knowii Community', 
    'https://gumroad.com/l/xjpgo'
),
(
    'The BCBA Career Transition Toolkit (CTT)', 'Mariah Padilla, MA, BCBA', 'Templates', 147.0, 20, 
    2940.0, 5.0, 0, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/qxxckx'
),
(
    'Pack d''heures Production Design', 'Bter - Joffrey Jochum', 'Templates', 600.0, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Pack d''heures de production Design', 
    'https://gumroad.com/l/crjgo'
),
(
    'Procedure Tracking Template', 'Manan Parekh, MD', 'Templates', 17.0, 108, 
    1836.0, 5.0, 1, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/xvuget'
),
(
    'The Solopreneur Operating System', 'Huy Nguyen', 'Templates', 149.99, 272, 
    40797.28, 5.0, 12, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'You''ll get...', 
    'https://gumroad.com/l/xhrdb'
),
(
    'The UGC Pitching System ✨💸', 'Rylie Lane', 'Templates', 47.0, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'the pitching system that gets 7 in 10 brands to actually reply 👀 (I can''t keep up with the replies anymore)', 
    'https://gumroad.com/l/xfovz'
),
(
    'Obsidian Starter Kit and community', 'Sébastien Dubois', 'Templates', 199.99, 1043, 
    208589.57, 4.8, 51, 4, 
    2, 0, ARRAY['High Revenue'], 
    'One copy of the Obsidian Starter Kit', 
    'https://gumroad.com/l/mghmmj'
),
(
    'Headquarters Toolkit: Notion Productivity Bundle', 'Productive Setups', 'Templates', 149.0, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/psxiq'
),
(
    'The Mental Load Offload · A 6-Module System for the Default Parent', 'Erin Kee', 'Templates', 127.0, 0, 
    0.0, 5.0, 1, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'the 6-module system that gets the invisible household work out of your head and into something that runs without you. built in austin by a mom of two who was carrying 78%.', 
    'https://gumroad.com/l/lgjnc'
),
(
    '🌟Lifetime Membership – One-Time Payment, Lifetime Access 💎 ', 'Hams AI Tech', 'Templates', 4999.99, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Elevate your learning experience with a Lifetime Membership! Gain unlimited access to our vast resources and enjoy the added perk of receiving exciting new content every month.', 
    'https://gumroad.com/l/jxydga'
),
(
    'Notion Life OS', 'Heyismail', 'Templates', 0.0, 11853, 
    0.0, 4.9, 167, 2, 
    1, 0, ARRAY['Niche Leader', 'Strong Social Proof', 'Free Lead Magnet'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/kxnze'
),
(
    'Notion For Businesses ', 'Heyismail', 'Business', 0.0, 964, 
    0.0, 4.8, 29, 4, 
    0, 0, ARRAY['Free Lead Magnet'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/wlleu'
),
(
    'The Ultimate Notion Templates Bundle​', 'MrPugo', 'Templates', 249.0, 0, 
    0.0, 5.0, 75, 1, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/isrlq'
),
(
    'Our Empire - Notion System', 'Our Empire', 'Templates', 44.99, 0, 
    0.0, 5.0, 3, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/flmgzy'
),
(
    'Notioly - 500+ Notion-style Illustrations', 'Mary Amato', 'Templates', 39.0, 0, 
    0.0, 5.0, 182, 0, 
    0, 0, ARRAY['Strong Social Proof'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/dxsgg'
),
(
    'Premium 会员 / Premium Membership', '安迪兄弟在美国', 'Templates', 0.0, 0, 
    0.0, 5.0, 0, 0, 
    0, 0, ARRAY['Free Lead Magnet'], 
    'You''ll get full access to all Notion research content and exclusive community support.', 
    'https://gumroad.com/l/jnjjqy'
),
(
    'FRCA Primary Toolkit', 'Anaestheasier', 'Templates', 99.0, 0, 
    0.0, 5.0, 27, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'Lifelong access to our customisable FRCA Primary Toolkit', 
    'https://gumroad.com/l/VLbKG'
),
(
    'Notion Complete Bundle', 'Heyismail', 'Templates', 0.0, 110, 
    0.0, 5.0, 3, 0, 
    0, 0, ARRAY['Free Lead Magnet'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/vgcmfi'
),
(
    'Пазл вкусов', 'Mayya Kim', 'Templates', 19.0, 0, 
    0.0, 5.0, 8, 0, 
    0, 0, ARRAY['Fast Growing'], 
    'По всем вопросам можете писать на почту: @kimmimayya@gmail.com Или в мессенджеры: WhatsApp / Telegram: +82 10-8424-5226', 
    'https://gumroad.com/l/pfvjhw'
),
(
    'Gamified Life OS: Solo Leveling', 'Kevechino', 'Templates', 0.0, 1842, 
    0.0, 5.0, 74, 3, 
    0, 0, ARRAY['Free Lead Magnet'], 
    'Gamified Life OS', 
    'https://gumroad.com/l/mcztuh'
),
(
    'Headquarters Notion Productivity Template', 'Productive Setups', 'Templates', 79.0, 0, 
    0.0, 5.0, 194, 1, 
    0, 0, ARRAY['Strong Social Proof'], 
    'Strong market presence with positive buyer reviews.', 
    'https://gumroad.com/l/hpqcg'
),
(
    'The Ultimate Mental Models Playbook', 'Become Superhuman', 'Templates', 0.0, 7221, 
    0.0, 4.8, 123, 2, 
    0, 2, ARRAY['Niche Leader', 'Strong Social Proof', 'Free Lead Magnet'], 
    'The thinking strategies used by Feynman, Musk, and Munger to solve impossible problems.   Enter whatever you wish to get the eBook. Your contribution helps us keep our content free and accessible for everyone. ❤️', 
    'https://gumroad.com/l/ibdlh'
)
ON CONFLICT (product_url) DO UPDATE SET
    estimated_sales = EXCLUDED.estimated_sales,
    estimated_revenue = EXCLUDED.estimated_revenue,
    avg_rating = EXCLUDED.avg_rating,
    total_reviews = EXCLUDED.total_reviews,
    ai_gap_analysis = EXCLUDED.ai_gap_analysis;