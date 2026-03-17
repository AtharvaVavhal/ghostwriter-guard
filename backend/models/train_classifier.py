import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib
import sys
import os

# Allow imports from backend/pipeline
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../.."))

from backend.pipeline.perplexity import get_perplexity
from backend.pipeline.burstiness import get_burstiness

# Load data
print("Loading data...")
train = pd.read_csv("dataset/train.csv")
test  = pd.read_csv("dataset/test.csv")

# Use 1000 train / 300 test for speed during hackathon
train = train.sample(min(1000, len(train)), random_state=42)
test  = test.sample(min(300,  len(test)),  random_state=42)


def extract_features(texts: list) -> np.ndarray:
    features = []
    for i, text in enumerate(texts):
        if i % 50 == 0:
            print(f"  Features: {i}/{len(texts)}")
        perp  = get_perplexity(str(text)[:500])
        burst = get_burstiness(str(text))
        features.append([perp, burst])
    return np.array(features)


print("Extracting train features (takes ~5 min)...")
X_train = extract_features(train["text"].tolist())
y_train = train["label"].tolist()

print("Extracting test features...")
X_test = extract_features(test["text"].tolist())
y_test = test["label"].tolist()

print("Training LogisticRegression...")
clf = LogisticRegression(max_iter=1000, random_state=42)
clf.fit(X_train, y_train)

preds = clf.predict(X_test)
print(f"\nAccuracy: {accuracy_score(y_test, preds):.2%}")
print(classification_report(y_test, preds, target_names=["Human", "AI"]))

save_path = os.path.join(os.path.dirname(__file__), "model.pkl")
joblib.dump(clf, save_path)
print(f"\nModel saved to {save_path}")