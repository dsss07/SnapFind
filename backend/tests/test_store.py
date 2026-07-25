from app.ai.clip_engine import encode_image
from app.ai.chroma_engine import ChromaEngine

db = ChromaEngine()

embedding = encode_image("screenshots/test.png")

db.add_embedding(
    image_id="1",
    embedding=embedding,
    metadata={
        "filename":"test.png"
    }
)

print("Stored Successfully!")