<<<<<<< HEAD
"""
fusion.py
---------
Combines 3 signals into a final AI probability score in [0, 1].

Signals:
  - perplexity:  Raw GPT-2 perplexity value (higher = more human-like)
  - burstiness:  Normalized [0,1] (higher = more human-like variation)
  - ml_score:    LogisticRegression P(AI) in [0,1] (higher = more AI-like)

Fusion strategy: weighted average
  - ML classifier gets highest weight (most reliable signal)
  - Perplexity is normalized then inverted (high perplexity = low AI score)
  - Burstiness is inverted (high burstiness = low AI score)
"""

WEIGHTS = {
    "ml": 0.55,
    "perplexity": 0.25,
    "burstiness": 0.20,
}

# Normalization range for perplexity (empirically tuned on HC3 corpus)
PERPLEXITY_MIN = 10.0
PERPLEXITY_MAX = 500.0


def normalize_perplexity(perplexity: float) -> float:
    """
    Converts raw perplexity to an AI-likelihood score in [0, 1].
    Low perplexity (predictable) → high AI score.
    High perplexity (surprising) → low AI score.
    """
    clipped = min(max(perplexity, PERPLEXITY_MIN), PERPLEXITY_MAX)
    normalized = (clipped - PERPLEXITY_MIN) / (PERPLEXITY_MAX - PERPLEXITY_MIN)
    return 1.0 - normalized  # Invert: low perplexity = high AI probability


def fuse_signals(perplexity: float, burstiness: float, ml_score: float) -> float:
    """
    Returns final AI probability score in [0, 1].
    0.0 = Definitely Human
    0.5 = Uncertain
    1.0 = Definitely AI
    """
    perplexity_score = normalize_perplexity(perplexity)
    burstiness_score = 1.0 - burstiness  # Invert: high burstiness = human

    final_score = (
        WEIGHTS["ml"] * ml_score
        + WEIGHTS["perplexity"] * perplexity_score
        + WEIGHTS["burstiness"] * burstiness_score
    )

    return float(min(max(final_score, 0.0), 1.0))


if __name__ == "__main__":
    # Example: typical AI sentence
    score = fuse_signals(perplexity=45.0, burstiness=0.1, ml_score=0.88)
    print(f"AI sentence score:    {score:.4f}")  # Expected: high

    # Example: typical human sentence
    score = fuse_signals(perplexity=320.0, burstiness=0.75, ml_score=0.12)
    print(f"Human sentence score: {score:.4f}")  # Expected: low
=======
import nltk
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)
from nltk.tokenize import sent_tokenize

from backend.pipeline.perplexity import get_perplexity
from backend.pipeline.burstiness import get_burstiness
from backend.pipeline.classifier import predict_sentence


def analyze_text(text: str) -> dict:
    """
    Main entry point called by the API.
    Splits text into sentences, scores each one,
    returns per-sentence results + overall verdict.
    """
    sentences = sent_tokenize(text)
    results = []

    for sent in sentences:
        sent = sent.strip()
        if len(sent.split()) < 5:   # skip fragments
            continue

        perp  = get_perplexity(sent)
        burst = get_burstiness(sent)
        pred  = predict_sentence(perp, burst)

        results.append({
            "sentence":   sent,
            "perplexity": perp,
            "burstiness": burst,
            "label":      pred["label"],
            "confidence": pred["confidence"]
        })

    if not results:
        return {"sentences": [], "verdict": {}}

    # --- Overall verdict ---
    ai_count    = sum(1 for r in results if r["label"] == "AI")
    human_count = sum(1 for r in results if r["label"] == "Human")
    total       = len(results)
    ai_ratio    = round(ai_count / total, 2)

    if ai_ratio > 0.6:
        verdict_text = "Likely AI-generated"
    elif ai_ratio > 0.35:
        verdict_text = "Mixed — partial AI use suspected"
    else:
        verdict_text = "Likely Human-written"

    return {
        "sentences": results,
        "verdict": {
            "overall_score":    ai_ratio,
            "verdict":          verdict_text,
            "ai_sentences":     ai_count,
            "human_sentences":  human_count,
            "uncertain_sentences": total - ai_count - human_count,
            "total_sentences":  total
        }
    }
>>>>>>> 766e05244e94108eb085ced2ff41d216332d5ee5
