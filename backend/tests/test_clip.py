from app.ai.clip_engine import encode_image

embedding = encode_image("screenshots/test.png")

print(embedding)
print(embedding.shape)