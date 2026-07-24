import easyocr

reader = easyocr.Reader(['en'])


def extract_text(image_path: str) -> str:
    result = reader.readtext(image_path)

    text = " ".join([detection[1] for detection in result])

    return text