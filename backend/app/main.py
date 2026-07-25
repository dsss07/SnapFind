from fastapi import FastAPI

from app.database.sqlite import create_tables
from app.database.bm25 import build_index

from app.routes.search_routes import router as search_router


create_tables()

build_index()

app = FastAPI(
    title="SnapSeek AI",
    description="AI Powered Screenshot Search Engine",
    version="1.0.0"
)

app.include_router(search_router)


@app.get("/")
def home():

    return {
        "message": "SnapSeek AI Backend Running 🚀"
    }