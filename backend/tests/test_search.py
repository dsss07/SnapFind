from app.ai.clip_engine import encode_image
from app.ai.chroma_engine import ChromaEngine

db = ChromaEngine()

query_embedding = encode_image("screenshots/test.png")

results = db.search(query_embedding)

print(results)