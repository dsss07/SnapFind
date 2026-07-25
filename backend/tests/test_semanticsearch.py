from app.database.chroma import semantic_search

results = semantic_search("programming challenge")

print(results)