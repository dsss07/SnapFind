import os

from app.ai.clip_engine import encode_image
from app.ai.ocr_engine import extract_text

from app.database.sqlite import insert_screenshot
from app.database.chroma import add_screenshot
from app.database.bm25 import build_index


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