from fastapi import APIRouter
from pydantic import BaseModel

from app.services.search_service import search

router = APIRouter()


class SearchRequest(BaseModel):
    query: str


@router.post("/search")
def search_screenshots(request: SearchRequest):

    results = search(request.query)

    return {
        "results": results
    }