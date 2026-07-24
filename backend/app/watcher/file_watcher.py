from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
from app.services.ingestion_service import process_screenshot

class ScreenshotHandler(FileSystemEventHandler):

    def on_created(self, event):
        if event.is_directory:
            return

        process_screenshot(event.src_path)


def start_watcher(path):

    observer = Observer()
    observer.schedule(ScreenshotHandler(), path, recursive=False)

    observer.start()

    print(f"👀 Watching folder: {path}")

    try:
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        observer.stop()

    observer.join()