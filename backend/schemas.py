from pydantic import BaseModel, Field
from typing import List


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The text to analyze for AI authorship.")

    class Config:
        json_schema_extra = {
            "example": {
                "text": "The quick brown fox jumps over the lazy dog. This sentence was written by a human."
            }
        }


class SentenceResult(BaseModel):
    sentence: str = Field(..., description="The individual sentence.")
    score: float = Field(..., ge=0.0, le=1.0, description="AI probability score: 0=Human, 1=AI.")

    class Config:
        json_schema_extra = {
            "example": {
                "sentence": "The quick brown fox jumps over the lazy dog.",
                "score": 0.12
            }
        }


class AnalyzeResponse(BaseModel):
    sentences: List[SentenceResult] = Field(..., description="Per-sentence results.")
    overall_score: float = Field(..., ge=0.0, le=1.0, description="Mean AI probability across all sentences.")

    class Config:
        json_schema_extra = {
            "example": {
                "sentences": [
                    {"sentence": "The quick brown fox jumps over the lazy dog.", "score": 0.12},
                    {"sentence": "This sentence was written by a human.", "score": 0.08}
                ],
                "overall_score": 0.10
            }
        }
