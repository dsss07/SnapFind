from app.ai.clip_engine import encode_image
from app.ai.chroma_engine import ChromaEngine

db = ChromaEngine()

query = encode_image("screenshots/leetcode_question.png")

results = db.search(query, n_results=5)

print(results)