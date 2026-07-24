from fastapi import APIRouter
from pydantic import BaseModel

from app.services.bm25_service import search

router = APIRouter()

class SearchRequest(BaseModel):
    query: str


@router.post("/search")
def search_screenshots(request: SearchRequest):

    results = search(request.query)

    return {
        "results": results
    }