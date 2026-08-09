import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_banner():
    width, height = 1280, 800
    # Create dark background
    banner = Image.new('RGB', (width, height), '#09090b')
    draw = ImageDraw.Draw(banner)
    
    # Draw some purple gradient/glow in the background
    for y in range(height):
        # Subtle gradient from top-left to bottom-right
        r = int(9 + (y / height) * 20)
        g = int(9 + (y / height) * 15)
        b = int(11 + (y / height) * 30 + 10) # slight purple tint
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    # Add a glowing purple orb on the left behind the text
    try:
        orb = Image.new('RGBA', (600, 600), (0, 0, 0, 0))
        orb_draw = ImageDraw.Draw(orb)
        orb_draw.ellipse((0, 0, 600, 600), fill=(168, 85, 247, 40)) # purple-500 with low opacity
        orb_blurred = orb.filter(ImageFilter.GaussianBlur(100))
        banner.paste(orb_blurred, (-100, 100), orb_blurred)
    except Exception as e:
        print("Glow error:", e)

    # Use Windows built-in fonts (Segoe UI)
    try:
        title_font = ImageFont.truetype('segoeuib.ttf', 72)
        desc_font = ImageFont.truetype('segoeui.ttf', 36)
    except Exception as e:
        print("Font load failed, using default:", e)
        title_font = ImageFont.load_default()
        desc_font = ImageFont.load_default()

    # Draw Text
    title_text = "Unlock Gumroad\nSales Analytics"
    desc_text = "Instantly reveal estimated revenue,\nsales volume, and hidden metrics\ndirectly on any product page."
    
    # Left padding
    padding_x = 80
    
    draw.text((padding_x, 220), title_text, fill="white", font=title_font)
    draw.text((padding_x, 420), desc_text, fill="#a1a1aa", font=desc_font) # zinc-400

    # Process Screenshot
    screenshot_path = os.path.join("store-assets", "screenshot_2_sales_intelligence.png")
    if os.path.exists(screenshot_path):
        screenshot = Image.open(screenshot_path).convert("RGBA")
        
        # Resize screenshot to fit nicely on the right
        # Target height around 600
        target_h = 640
        aspect_ratio = screenshot.width / screenshot.height
        target_w = int(target_h * aspect_ratio)
        screenshot = screenshot.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Add rounded corners to screenshot
        mask = Image.new('L', (target_w, target_h), 0)
        draw_mask = ImageDraw.Draw(mask)
        rad = 20
        draw_mask.rounded_rectangle((0, 0, target_w, target_h), rad, fill=255)
        
        # Create a new image with transparent background for the rounded screenshot
        rounded_screenshot = Image.new('RGBA', (target_w, target_h))
        rounded_screenshot.paste(screenshot, (0, 0), mask=mask)
        
        # Add a subtle shadow
        shadow = Image.new('RGBA', (target_w + 40, target_h + 40), (0, 0, 0, 0))
        shadow_draw = ImageDraw.Draw(shadow)
        shadow_draw.rounded_rectangle((20, 20, target_w+20, target_h+20), rad, fill=(0, 0, 0, 150))
        shadow = shadow.filter(ImageFilter.GaussianBlur(15))
        
        paste_x = width - target_w - 60
        paste_y = (height - target_h) // 2
        
        banner.paste(shadow, (paste_x - 20, paste_y - 20), shadow)
        banner.paste(rounded_screenshot, (paste_x, paste_y), rounded_screenshot)
    else:
        print(f"Could not find {screenshot_path}")

    # Save
    out_path = os.path.join("store-assets", "marquee_banner_1280x800.png")
    banner.save(out_path)
    print(f"Banner saved to {out_path}")

if __name__ == '__main__':
    create_banner()
