from fastapi import APIRouter, HTTPException

from app.database.sqlite import get_all_screenshot_objects, get_all_screenshots, get_screenshot

router = APIRouter()


@router.get("/screenshot/{filename}")
def get_screenshot_details(filename: str):

    screenshot = get_screenshot(filename)

    if screenshot is None:
        raise HTTPException(status_code=404, detail="Screenshot not found")

    return screenshot

@router.get("/screenshots")
def get_screenshots():

    return get_all_screenshot_objects()

from app.services.index_service import sync_screenshots
@router.post("/sync")
def sync():

    return sync_screenshots()