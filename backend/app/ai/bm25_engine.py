import re

from rank_bm25 import BM25Okapi


class BM25Engine:

    def __init__(self):

        self.bm25 = None
        self.documents = []
        self.metadata = []

    def tokenize(self, text):

        return re.findall(r"\w+", text.lower())

    def build_index(self, rows):

        self.documents = []
        self.metadata = []

        for filename, text in rows:

            if not text:
                continue

            self.documents.append(
                self.tokenize(text)
            )

            self.metadata.append({
                "filename": filename,
                "ocr_text": text
            })

        if self.documents:
            self.bm25 = BM25Okapi(self.documents)
        else:
            self.bm25 = None

    def search(self, query, top_k=10):

        if self.bm25 is None:
            return []

        query_tokens = self.tokenize(query)

        scores = self.bm25.get_scores(query_tokens)

        results = []

        for meta, score in zip(self.metadata, scores):

            if score <= 0:
                continue

            results.append({
                "filename": meta["filename"],
                "ocr_text": meta["ocr_text"],
                "score": float(score)
            })

        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return results[:top_k]