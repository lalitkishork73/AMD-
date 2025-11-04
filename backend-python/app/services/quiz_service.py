from app.models.quiz_model import QuizRequest, QuizResponse

def generate_quiz(request: QuizRequest) -> QuizResponse:
    # Dummy example (later: connect with LlamaIndex / LLM)
    questions = [f"Question {i+1} from content" for i in range(request.num_questions)]
    return QuizResponse(questions=questions)
