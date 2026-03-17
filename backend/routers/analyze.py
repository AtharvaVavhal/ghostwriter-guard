from fastapi import APIRouter, HTTPException
from backend.schemas import AnalyzeRequest, AnalyzeResponse, SentenceResult
from backend.pipeline.perplexity import compute_perplexity
from backend.pipeline.burstiness import compute_burstiness
from backend.pipeline.classifier import predict_score
from backend.pipeline.fusion import fuse_signals
import nltk

nltk.download("punkt", quiet=True)

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    """
    Accepts a block of text, splits it into sentences,
    runs the 3-signal ML pipeline, and returns per-sentence scores.
    """
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # Split into sentences
    sentences = nltk.sent_tokenize(text)
    if not sentences:
        raise HTTPException(status_code=400, detail="Could not extract sentences.")

    results = []
    scores = []

    for sentence in sentences:
        if len(sentence.split()) < 3:
            # Too short to score reliably — treat as uncertain
            score = 0.5
        else:
            perplexity = compute_perplexity(sentence)
            burstiness = compute_burstiness(sentence)
            ml_score = predict_score(sentence)
            score = fuse_signals(perplexity, burstiness, ml_score)

        scores.append(score)
        results.append(SentenceResult(sentence=sentence, score=round(score, 4)))

    overall_score = round(sum(scores) / len(scores), 4) if scores else 0.0

    return AnalyzeResponse(sentences=results, overall_score=overall_score)
