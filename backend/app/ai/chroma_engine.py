import chromadb

class ChromaEngine:

    def __init__(self):
        self.client = chromadb.PersistentClient(path="./chroma_db")

        self.collection = self.client.get_or_create_collection(
            name="snapfind",
            metadata={"hnsw:space": "cosine"}
         )
    
    def add_embedding(self, image_id, embedding, metadata):
        self.collection.add(
            ids=[image_id],
            embeddings=[embedding],
            metadatas=[metadata]
        )

    def search(self, query_embedding, n_results=5):
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return results
