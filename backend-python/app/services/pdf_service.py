# app/services/pdf_service.py
import os
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding
import pinecone
from app.core import config


def save_uploaded_pdf(file, doc_id: str) -> str:
    """
    Saves an uploaded PDF file to tmp/{doc_id}/document.pdf
    """
    folder = f"tmp/{doc_id}"
    os.makedirs(folder, exist_ok=True)
    file_path = f"{folder}/document.pdf"

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    return file_path


def create_index_pinecone(doc_id: str, file_path: str):
    """
    Creates an index using Pinecone vector store (no local JSON files).
    """
    # Initialize Pinecone
    pinecone.init(
        api_key=config.settings.PINECONE_API_KEY,
        environment=config.settings.PINECONE_ENVIRONMENT
    )

    # Prepare embedding model
    embed_model = OpenAIEmbedding(api_key=config.settings.OPENAI_API_KEY)

    # Load document
    reader = SimpleDirectoryReader(input_files=[file_path])
    docs = reader.load_data()

    # Create vector store on Pinecone
    vector_store = PineconeVectorStore(
        index_name=doc_id,
        namespace=config.settings.VECTOR_STORE_NAMESPACE
    )

    # Create and return the index
    index = VectorStoreIndex.from_documents(
        docs,
        vector_store=vector_store,
        embed_model=embed_model
    )

    print(f"✅ Index created on Pinecone for document {doc_id}")
    return index
