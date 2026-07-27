import time
import os

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from app.database.bm25 import build_index
from app.database.sqlite import screenshot_exists
from app.services.index_service import index_screenshot


class ScreenshotHandler(FileSystemEventHandler):

    def on_created(self, event):

        if event.is_directory:
            return

        if not event.src_path.lower().endswith((".png", ".jpg", ".jpeg")):
            return

        filename = os.path.basename(event.src_path)

        if screenshot_exists(filename):
            return

        print(f"📷 New screenshot detected: {filename}")

        try:
            index_screenshot(event.src_path)
            build_index()
            print(f"✅ Indexed {filename}")

        except Exception as e:
            print(e)


observer = None


def start_watchdog(folder="screenshots"):

    global observer

    observer = Observer()

    handler = ScreenshotHandler()

    observer.schedule(
        handler,
        folder,
        recursive=False
    )

    observer.start()

    print(f"🐶 Watchdog Started -> {folder}")

def stop_watchdog():

    global observer

    if observer is not None:
        observer.stop()
        observer.join()
        observer = None