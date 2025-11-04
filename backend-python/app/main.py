from fastapi import FastAPI
# from app.api.quiz_router import router as quiz_router
from app.api.pdf_router import router as pdf_router
# from app.api.chat_router import router as chat_router
from app.core.logging import logger
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        debug=settings.DEBUG
    )

    @app.on_event("startup")
    async def startup():
        logger.info("Starting up the FastAPI application...")

    @app.get("/")
    async def root():
        return {"message": "Backend-Python: Hello World Lalit"}


    @app.get("/test")
    async def test():
        return {"service": "backend-python", "message": "Hello from Python"}

    # Routers
    # app.include_router(health_router, prefix="/health")
    app.include_router(pdf_router, prefix="/api/v1/pdf")
    # app.include_router(chat_router, prefix="/chat")
    # app.include_router(quiz_router, prefix="/api/v1", tags=["Quiz"])
   

    return app




app = create_app()



