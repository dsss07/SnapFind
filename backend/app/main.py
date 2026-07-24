from fastapi import FastAPI
from app.routes.search_routes import router as search_router
from app.database.sqlite import create_tables
from app.services.bm25_service import build_index

create_tables()
app = FastAPI(
    title="SnapSeek AI",
    description="AI Powered Screenshot Search Engine",
    version="1.0.0"
)

build_index()
app.include_router(search_router)


@app.get("/")
def home():
    return {
        "message": "SnapSeek AI Backend Running 🚀"
    }