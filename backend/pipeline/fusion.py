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
