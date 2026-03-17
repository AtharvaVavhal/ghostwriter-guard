WEIGHTS = {
    "ml": 0.70,
    "perplexity": 0.20,
    "burstiness": 0.10,
}

PERPLEXITY_MIN = 10.0
PERPLEXITY_MAX = 500.0

def normalize_perplexity(perplexity: float) -> float:
    clipped = min(max(perplexity, PERPLEXITY_MIN), PERPLEXITY_MAX)
    normalized = (clipped - PERPLEXITY_MIN) / (PERPLEXITY_MAX - PERPLEXITY_MIN)
    return 1.0 - normalized

def fuse_signals(perplexity: float, burstiness: float, ml_score: float) -> float:
    perplexity_score = normalize_perplexity(perplexity)
    burstiness_score = 1.0 - burstiness
    final_score = (
        WEIGHTS["ml"] * ml_score
        + WEIGHTS["perplexity"] * perplexity_score
        + WEIGHTS["burstiness"] * burstiness_score
    )
    return float(min(max(final_score, 0.0), 1.0))
