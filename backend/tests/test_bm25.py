from app.database.bm25 import build_index, search

build_index()

results = search("rotate array")

print(results)