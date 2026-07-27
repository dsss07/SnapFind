from tkinter import Tk, filedialog
import os

from fastapi import APIRouter

from app.database.sqlite import get_settings_data

from pydantic import BaseModel
from app.database.sqlite import (
    get_settings_data,
    clear_screenshots,
)
from app.database.sqlite import set_setting
from app.services.watchdog_service import stop_watchdog, start_watchdog
from app.services.index_service import sync_screenshots
from app.database.sqlite import clear_screenshots
from app.database.chroma import clear_database
from app.services.bm25_service import build_index

router = APIRouter()


@router.get("/settings")
def settings():

    return get_settings_data()


@router.get("/browse-folder")
def browse_folder():

    root = Tk()
    root.withdraw()
    root.attributes("-topmost", True)

    folder = filedialog.askdirectory()

    root.destroy()

    return {
        "folder": folder
    }

class FolderRequest(BaseModel):
    folder: str

@router.post("/settings/folder")
def update_folder(request: FolderRequest):

    if not os.path.isdir(request.folder):
        return {
            "success": False,
            "message": "Folder does not exist."
        }

    stop_watchdog()

    set_setting(
        "screenshot_folder",
        request.folder
    )

    clear_screenshots()

    clear_database()

    result = sync_screenshots(request.folder)

    build_index()

    start_watchdog(request.folder)

    return {
        "success": True,
        **result
    }