
import os
import json
import sys
from supabase import create_client

URL = 'https://gefzuacjuekhdlkfaned.supabase.co'
KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')

if not KEY:
    print('ERROR: You must set the SUPABASE_SERVICE_ROLE_KEY environment variable.')
    sys.exit(1)

c = create_client(URL, KEY)

with open('scraped_products.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f'Uploading {len(data)} products to Supabase...')

for i in range(0, len(data), 100):
    batch = data[i:i+100]
    c.table('products').upsert(batch, on_conflict='product_url').execute()
    print(f'  -> Uploaded batch {i//100 + 1}')

print('? All products successfully uploaded to the database!')

