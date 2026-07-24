import re

from rank_bm25 import BM25Okapi

from app.database.sqlite import get_all_screenshots


# BM25 Index
bm25 = None

# Tokenized documents
documents = []

# Metadata corresponding to each document
metadata = []


def tokenize(text: str):
    """
    Convert text into lowercase word tokens.
    Removes punctuation.
    """

    return re.findall(r"\w+", text.lower())


def build_index():

    global bm25, documents, metadata

    rows = get_all_screenshots()

    documents = []
    metadata = []

    for filename, text in rows:

        if not text:
            continue

        documents.append(tokenize(text))

        metadata.append({
            "filename": filename,
            "ocr_text": text
        })

    if documents:
        bm25 = BM25Okapi(documents)
        print(f"✅ BM25 Index Built ({len(documents)} screenshots)")
    else:
        bm25 = None
        print("⚠ No screenshots found.")


def search(query: str, top_k: int = 10):

    if bm25 is None:
        return []

    if not query.strip():
        return []

    query_tokens = tokenize(query)

    scores = bm25.get_scores(query_tokens)

    results = []

    for meta, score in zip(metadata, scores):

        if score <= 0:
            continue

        results.append({
            "filename": meta["filename"],
            "ocr_text": meta["ocr_text"],
            "score": round(float(score), 3)
        })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results[:top_k]


def refresh_index():
    """
    Rebuild BM25 index.
    Currently not used because Watchdog
    runs in a separate process.
    """

    build_index()