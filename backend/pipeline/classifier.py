import joblib
import numpy as np
import os
import nltk

nltk.download("punkt_tab", quiet=True)

_model = None
_MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/model.pkl")


def _load_model():
    global _model
    if _model is None:
        if not os.path.exists(_MODEL_PATH):
            return None
        _model = joblib.load(_MODEL_PATH)
    return _model


def extract_features(text: str) -> np.ndarray:
    words = text.split()
    if not words:
        return np.array([[0.0] * 8])

    unique_ratio = len(set(words)) / len(words)
    avg_word_len = float(np.mean([len(w) for w in words]))

    sentences = nltk.sent_tokenize(text)
    word_counts = [len(s.split()) for s in sentences if s.strip()]
    if len(word_counts) < 2:
        wc = word_counts[0] if word_counts else 10
        burstiness = float(min(max((wc - 5) / 35, 0.0), 1.0))
    else:
        burstiness = float(min(np.std(word_counts) / 15.0, 1.0))

    punct_ratio = sum(1 for c in text if c in ".,;:!?\"'()-") / max(len(text), 1)
    avg_sent_len = float(np.mean([len(s.split()) for s in sentences])) if sentences else 0.0

    fillers = ["honestly", "actually", "basically", "literally", "just", "really", "tbh", "kinda", "sorta", "yeah"]
    filler_ratio = sum(1 for w in words if w.lower() in fillers) / max(len(words), 1)

    formal = ["furthermore", "moreover", "consequently", "therefore", "subsequently", "additionally", "nonetheless", "whereby", "thereby", "hence"]
    formal_ratio = sum(1 for w in words if w.lower() in formal) / max(len(words), 1)

    contractions = ["i'm", "it's", "don't", "can't", "won't", "i've", "we're", "they're", "i'd", "you're"]
    contraction_ratio = sum(1 for w in words if w.lower() in contractions) / max(len(words), 1)

    return np.array([[unique_ratio, avg_word_len, burstiness, punct_ratio,
                      avg_sent_len, filler_ratio, formal_ratio, contraction_ratio]])


def predict_score(text: str) -> float:
    model = _load_model()
    if model is None:
        return 0.5
    features = extract_features(text)
    prob = model.predict_proba(features)[0]
    return float(prob[1])


if __name__ == "__main__":
    samples = [
        "The mitochondria is the powerhouse of the cell and plays a critical role.",
        "I dunno, it was just kinda weird how that whole thing went down tbh.",
    ]
    for s in samples:
        print(f"Score: {predict_score(s):.4f} | {s[:60]}")
