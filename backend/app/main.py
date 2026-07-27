import os
from fastapi.responses import FileResponse
from app.database.sqlite import get_setting
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database.sqlite import create_tables, get_setting, set_setting
from app.database.bm25 import build_index
from fastapi.staticfiles import StaticFiles
from app.routes.search_routes import router as search_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.screenshot_routes import router as screenshot_router
from app.services.watchdog_service import start_watchdog
from app.routes.settings_routes import router as settings_router
from app.database.sqlite import (
    create_tables,
    get_setting,
    set_setting,
)
import os
print("1")
create_tables()
if get_setting("screenshot_folder") is None:
    set_setting(
        "screenshot_folder",
        os.path.abspath("screenshots")
    )
print("2")
build_index()

print("3")
folder = get_setting("screenshot_folder") or os.path.abspath("screenshots")
start_watchdog(folder)

print("4")
app = FastAPI(
    title="SnapSeek AI",
    description="AI Powered Screenshot Search Engine",
    version="1.0.0"
)
print("5")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("6")
app.include_router(search_router)
app.include_router(screenshot_router)
app.include_router(settings_router)

@app.get("/")
def home():

    return {
        "message": "SnapSeek AI Backend Running "
    }

@app.get("/image/{filename}")
def get_image(filename: str):

    folder = get_setting("screenshot_folder") or os.path.abspath("screenshots")

    path = os.path.join(folder, filename)

    return FileResponse(path)