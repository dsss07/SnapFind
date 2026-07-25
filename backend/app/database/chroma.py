from app.ai.chroma_engine import ChromaEngine
from app.ai.clip_engine import encode_text

db = ChromaEngine()


def add_screenshot(image_id, embedding, filename):

    db.add_embedding(
        image_id=image_id,
        embedding=embedding,
        metadata={
            "filename": filename
        }
    )


def search_similar(embedding, n_results=5):

    results = db.search(
        embedding,
        n_results
    )

    output = []

    for meta, distance in zip(
        results["metadatas"][0],
        results["distances"][0]
    ):

        output.append({
            "filename": meta["filename"],
            "distance": distance
        })

    return output

def semantic_search(query, n_results=5):

    embedding = encode_text(query)

    return search_similar(
        embedding,
        n_results
    )