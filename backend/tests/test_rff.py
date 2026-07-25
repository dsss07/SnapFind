from app.services.rrf_service import reciprocal_rank_fusion

bm25 = [
    {"filename": "leetcode.png"},
    {"filename": "github.png"},
    {"filename": "speed.png"},
]

semantic = [
    {"filename": "github.png"},
    {"filename": "leetcode.png"},
    {"filename": "gmail.png"},
]

results = reciprocal_rank_fusion(
    bm25,
    semantic
)

for r in results:
    print(r)