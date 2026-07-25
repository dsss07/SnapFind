import os

from app.ai.clip_engine import encode_image
from app.ai.chroma_engine import ChromaEngine

db = ChromaEngine()

folder = "screenshots"

for i, filename in enumerate(os.listdir(folder)):

    if filename.endswith((".png", ".jpg", ".jpeg")):

        path = os.path.join(folder, filename)

        embedding = encode_image(path)

        db.add_embedding(
            image_id=str(i + 1),
            embedding=embedding,
            metadata={
                "filename": filename
            }
        )

print("Done!")