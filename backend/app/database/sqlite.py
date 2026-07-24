import sqlite3

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

    conn.commit()

    conn.close()

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