from fastapi import APIRouter
from schemas import AnalyzeRequest, AnalyzeResponse

router = APIRouter()

@router.post("/analyze")
def analyze_text(request: AnalyzeRequest):
    sentences = request.text.split(". ")
    results = [{"sentence": s, "score": 0.5} for s in sentences if s]
    return {"results": results, "overall_score": 0.5}