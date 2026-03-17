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