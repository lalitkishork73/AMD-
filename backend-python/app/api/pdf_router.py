from fastapi import APIRouter,UploadFile, File, Form
from app.models.pdf_model import PDFMetadata
from app.services import pdf_service, rag_service

router = APIRouter()

@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    doc_id: str = Form(...),
    title: str = Form(...)
):
    """
    Uploads a PDF and creates a vector index in Pinecone using LlamaIndex.
    """
    # Save uploaded PDF
    file_path = pdf_service.save_uploaded_pdf(file, doc_id)

    # Create vector index on Pinecone
    pdf_service.create_index_pinecone(doc_id, file_path)

    return {
        "message": f"✅ Index created for '{title}'",
        "docId": doc_id,
        "status": "success"
    }

@router.get("/query/{doc_id}")
def query_doc(doc_id: str, q: str):
    engine = rag_service.get_query_engine(doc_id)
    response = engine.query(q)
    return {"answer": str(response)}
