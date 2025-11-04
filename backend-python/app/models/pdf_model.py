from pydantic import BaseModel

class PDFMetadata(BaseModel):
    doc_id: str
    user_id: str
    title: str
    url: str
