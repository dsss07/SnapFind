from app.ai.chroma_engine import ChromaEngine

db = ChromaEngine()

print(db.collection.count())