import os

from app.ai.ocr_engine import extract_text
from app.database.sqlite import insert_screenshot


def process_screenshot(image_path: str):

    print(f"\n📸 Processing: {image_path}")

    text = extract_text(image_path)

    # Convert list to string if OCR returns multiple lines
    if isinstance(text, list):
        text = " ".join(text)

    filename = os.path.basename(image_path)

    insert_screenshot(filename, text)

    print("\nOCR Result:")
    print(text)

    print("\n✅ Saved to SQLite Database")