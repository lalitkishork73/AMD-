from fastapi import APIRouter
from app.models.quiz_model import QuizRequest, QuizResponse
from app.services.quiz_service import generate_quiz

router = APIRouter()

@router.post("/generate-quiz", response_model=QuizResponse)
async def create_quiz(request: QuizRequest):
    quiz = await generate_quiz(request)
    return quiz