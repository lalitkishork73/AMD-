import os

def save_temp_file(file_content: bytes, filename: str) -> str:
    path = f"/tmp/{filename}"
    with open(path, "wb") as f:
        f.write(file_content)
    return path
