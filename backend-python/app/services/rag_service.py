from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb
from app.core import config

def get_query_engine(doc_id: str):
    client = chromadb.PersistentClient(path=f"{config.VECTOR_STORE_DIR}/{doc_id}")
    vector_store = ChromaVectorStore(chroma_client=client, collection_name=doc_id)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    index = load_index_from_storage(storage_context)
    return index.as_query_engine()
