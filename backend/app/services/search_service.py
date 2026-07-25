from app.database.bm25 import search as bm25_search
from app.database.chroma import semantic_search

from app.services.rrf_service import reciprocal_rank_fusion


def search(query):

    bm25_results = bm25_search(query)

    semantic_results = semantic_search(query)

    final_results = reciprocal_rank_fusion(
        bm25_results,
        semantic_results
    )

    return final_results