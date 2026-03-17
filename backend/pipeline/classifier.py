<<<<<<< HEAD
"""
classifier.py
-------------
Loads the trained LogisticRegression model (model.pkl) and runs inference.
Returns a probability score in [0, 1]: 0 = Human, 1 = AI.
"""

=======
>>>>>>> 766e05244e94108eb085ced2ff41d216332d5ee5
import joblib
import numpy as np
import os

<<<<<<< HEAD
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
    from backend.pipeline.perplexity import compute_perplexity
    from backend.pipeline.burstiness import compute_burstiness

    perplexity = compute_perplexity(text)
    burstiness = compute_burstiness(text)

    words = text.split()
    avg_word_len = np.mean([len(w) for w in words]) if words else 0.0

    punct_chars = sum(1 for c in text if c in ".,;:!?\"'()-")
    punct_ratio = punct_chars / max(len(text), 1)

    return np.array([[perplexity, burstiness, avg_word_len, punct_ratio]])


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
=======
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/model.pkl")

# Will fail if model.pkl not trained yet — train first
clf = joblib.load(MODEL_PATH)


def predict_sentence(perplexity: float, burstiness: float) -> dict:
    """
    Takes perplexity + burstiness scores.
    Returns label (AI/Human) and confidence (0-1).
    """
    features = np.array([[perplexity, burstiness]])
    label_idx = clf.predict(features)[0]
    proba = clf.predict_proba(features)[0]
    confidence = round(float(max(proba)), 2)
    label = "AI" if label_idx == 1 else "Human"
    return {"label": label, "confidence": confidence}
>>>>>>> 766e05244e94108eb085ced2ff41d216332d5ee5
