from app.database.bm25 import build_index
from app.services.search_service import search

build_index()

results = search("rotate array")

for r in results:
    print(r)