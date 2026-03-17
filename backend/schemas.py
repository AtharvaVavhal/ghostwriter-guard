from pydantic import BaseModel
from typing import List

class AnalyzeRequest(BaseModel):
    text: str

class SentenceResult(BaseModel):
    sentence: str
    score: float

class AnalyzeResponse(BaseModel):
    results: List[SentenceResult]
    overall_score: float