import http
import os
import sqlite3
from urllib.parse import quote

DATABASE_NAME = "snapfind.db"


def get_connection():
    return sqlite3.connect(DATABASE_NAME)


def create_tables():
    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS screenshots (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        filename TEXT,

        ocr_text TEXT

    )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings(
            key TEXT PRIMARY KEY,
            value TEXT
        )
        """)
    conn.commit()

    conn.close()

def set_setting(key, value):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT OR REPLACE INTO settings(key,value)
        VALUES(?,?)
        """,
        (key, value)
    )

    conn.commit()
    conn.close()


def insert_screenshot(filename, ocr_text):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO screenshots(filename, ocr_text)
        VALUES(?,?)
        """,
        (filename, ocr_text)
    )

    image_id = cursor.lastrowid

    conn.commit()

    conn.close()

    return image_id

def get_all_screenshots():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("""
                SELECT filename, ocr_text
                FROM screenshots
                """)

    rows = cursor.fetchall()

    conn.close()

    return rows

def get_screenshot_by_filename(filename):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT filename, ocr_text
        FROM screenshots
        WHERE filename = ?
        """,
        (filename,)
    )

    row = cursor.fetchone()

    conn.close()

    return row

def get_screenshot(filename):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT filename,
               ocr_text
        FROM screenshots
        WHERE filename = ?
        """,
        (filename,)
    )

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return None

    return {
        "filename": row[0],
        "ocr_text": row[1],
        "image_url": f"http://127.0.0.1:8000/screenshots/{row[0]}"
    }

def get_all_screenshot_objects():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT filename, ocr_text
        FROM screenshots
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    conn.close()

    screenshots = []

    for filename, ocr_text in rows:

        screenshots.append({
            "id": filename,
            "filename": filename,
            "filePath": filename,
            "imageUrl": f"http://127.0.0.1:8000/image/{quote(filename)}",
            "appSource": "Coming Soon",
            "category": "Other",
            "createdAt": "",
            "dimensions": {
                "width": 0,
                "height": 0,
            },
            "fileSizeMB": 0,
            "ocrText": ocr_text,
            "ocrBlocks": [],
            "tags": [],
            "isFavorite": False,
        })

    return screenshots

def get_screenshot_object(filename):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT filename, ocr_text
        FROM screenshots
        WHERE filename = ?
    """, (filename,))

    row = cursor.fetchone()

    conn.close()

    if row is None:
        return None

    filename, ocr_text = row

    return {
        "id": filename,
        "filename": filename,
        "filePath": filename,
        "imageUrl": f"http://127.0.0.1:8000/image/{quote(filename)}",
        "appSource": "Coming Soon",
        "category": "Other",
        "createdAt": "",
        "dimensions": {
            "width": 0,
            "height": 0,
        },
        "fileSizeMB": 0,
        "ocrText": ocr_text,
        "ocrBlocks": [],
        "tags": [],
        "isFavorite": False,
    }


def screenshot_exists(filename):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT 1
        FROM screenshots
        WHERE filename = ?
        """,
        (filename,)
    )
    exists = cursor.fetchone() is not None

    conn.close()

    return exists


def get_settings_data():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM screenshots")

    indexed = cursor.fetchone()[0]

    cursor.execute("SELECT ocr_text FROM screenshots")

    rows = cursor.fetchall()

    conn.close()

    total_words = 0

    for row in rows:

        if row[0]:
            total_words += len(row[0].split())

    db_size = os.path.getsize(DATABASE_NAME) / (1024 * 1024)

    return {

        "folder": get_setting("screenshot_folder") or os.path.abspath("screenshots"),

        "watchdog": True,

        "indexed": indexed,

        "ocr_words": total_words,

        "db_size": round(db_size, 2),

        "model": "OpenCLIP ViT-B/32",

        "ocr_engine": "EasyOCR",

        "hardware": "GPU"

    }

def get_setting(key):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT value FROM settings WHERE key=?",
        (key,)
    )

    row = cursor.fetchone()

    conn.close()

    return row[0] if row else None

def clear_screenshots():

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute("DELETE FROM screenshots")

    conn.commit()

    conn.close()
