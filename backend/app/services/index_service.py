import os

from app.ai.clip_engine import encode_image
from app.ai.ocr_engine import extract_text

from app.database.sqlite import screenshot_exists
from app.database.sqlite import insert_screenshot
from app.database.chroma import add_screenshot
from app.database.bm25 import build_index
from app.database.sqlite import (
    insert_screenshot,
    screenshot_exists,
)


def index_screenshot(image_path):

    # Store only the filename
    filename = os.path.basename(image_path)

    # OCR
    text = extract_text(image_path)

    # Save to SQLite
    image_id = insert_screenshot(
        filename,
        text
    )

    # Generate CLIP embedding
    embedding = encode_image(image_path)

    # Save to ChromaDB
    add_screenshot(
        image_id=str(image_id),
        embedding=embedding,
        filename=filename
    )

    # Refresh BM25
    build_index()

def sync_screenshots(folder="screenshots"):

    print("Starting sync...")

    indexed = 0
    skipped = 0

    for file in os.listdir(folder):

        print("Checking:", file)

        if not file.lower().endswith((".png", ".jpg", ".jpeg")):
            continue

        if screenshot_exists(file):
            print("Skipping:", file)
            skipped += 1
            continue

        print("Indexing:", file)

        image_path = os.path.join(folder, file)

        index_screenshot(image_path)

        indexed += 1

    print("Rebuilding BM25...")
    build_index()

    print("Done!")

    return {
        "indexed": indexed,
        "skipped": skipped
    }