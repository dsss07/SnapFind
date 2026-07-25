from app.ai.bm25_engine import BM25Engine
from app.database.sqlite import get_all_screenshots

engine = BM25Engine()


def build_index():

    rows = get_all_screenshots()

    engine.build_index(rows)


def search(query, top_k=10):

    return engine.search(
        query,
        top_k
    )