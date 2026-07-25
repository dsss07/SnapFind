def reciprocal_rank_fusion(
    bm25_results,
    semantic_results,
    k=60
):

    scores = {}

    # BM25
    for rank, result in enumerate(bm25_results, start=1):

        filename = result["filename"]

        scores[filename] = scores.get(filename, 0)

        scores[filename] += 1 / (k + rank)

    # Semantic
    for rank, result in enumerate(semantic_results, start=1):

        filename = result["filename"]

        scores[filename] = scores.get(filename, 0)

        scores[filename] += 1 / (k + rank)

    fused = []

    for filename, score in scores.items():

        fused.append({
            "filename": filename,
            "rrf_score": score
        })

    fused.sort(
        key=lambda x: x["rrf_score"],
        reverse=True
    )

    return fused