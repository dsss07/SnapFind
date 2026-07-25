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