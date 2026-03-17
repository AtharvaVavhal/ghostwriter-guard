import joblib
import numpy as np
import os

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