from pydantic import BaseModel
from typing import List

class QuizRequest(BaseModel):
    content: str
    num_questions: int = 5

class QuizResponse(BaseModel):
    questions: List[str]
