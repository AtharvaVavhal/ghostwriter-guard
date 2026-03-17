"""
train_classifier.py
-------------------
Trains LogisticRegression on AI vs Human text dataset.
Saves model.pkl with joblib.
"""

import numpy as np
import joblib
import os
import nltk
from datasets import load_dataset
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

nltk.download("punkt_tab", quiet=True)

MODEL_OUTPUT = os.path.join(os.path.dirname(__file__), "model.pkl")


def compute_burstiness(text: str) -> float:
    sentences = nltk.sent_tokenize(text)
    word_counts = [len(s.split()) for s in sentences if s.strip()]
    if len(word_counts) < 2:
        wc = word_counts[0] if word_counts else 10
        return float(min(max((wc - 5) / 35, 0.0), 1.0))
    return float(min(np.std(word_counts) / 15.0, 1.0))


def compute_perplexity_proxy(text: str) -> float:
    words = text.split()
    if not words:
        return 100.0
    unique_ratio = len(set(words)) / len(words)
    avg_len = np.mean([len(w) for w in words])
    return float(100.0 * (1 - unique_ratio) + avg_len * 5)


def extract_features(text: str) -> list:
    words = text.split()
    avg_word_len = float(np.mean([len(w) for w in words])) if words else 0.0
    punct_chars = sum(1 for c in text if c in ".,;:!?\"'()-")
    punct_ratio = punct_chars / max(len(text), 1)
    perplexity = compute_perplexity_proxy(text)
    burstiness = compute_burstiness(text)
    return [perplexity, burstiness, avg_word_len, punct_ratio]


def load_data(max_per_class: int = 5000):
    print("📥 Loading dataset (already cached)...")
    dataset = load_dataset("artem9k/ai-text-detection-pile", split="train")
    print(f"   Total rows: {len(dataset)}")

    human_data = []
    ai_data = []

    for item in dataset:
        text = item.get("text", "")
        source = str(item.get("source", "")).lower()

        if not text or len(text.split()) < 10:
            continue

        is_ai = any(k in source for k in ["ai", "gpt", "generated", "llm", "chatgpt", "openai"])
        is_human = any(k in source for k in ["human", "wiki", "reddit", "news", "book", "web"])

        if is_ai and len(ai_data) < max_per_class:
            ai_data.append((text.strip(), 1))
        elif is_human and len(human_data) < max_per_class:
            human_data.append((text.strip(), 0))

        if len(ai_data) >= max_per_class and len(human_data) >= max_per_class:
            break

    print(f"✅ Human: {len(human_data)} | AI: {len(ai_data)}")

    # Show unique source values for debugging
    sources = set()
    for item in dataset.select(range(min(1000, len(dataset)))):
        sources.add(item.get("source", ""))
    print(f"   Unique sources (sample): {sources}")

    return human_data + ai_data


def train():
    data = load_data(max_per_class=5000)

    if len(set(l for _, l in data)) < 2:
        print("❌ Still only one class. Printing all unique sources...")
        dataset = load_dataset("artem9k/ai-text-detection-pile", split="train")
        sources = set(item.get("source", "") for item in dataset.select(range(5000)))
        print(f"All sources found: {sources}")
        return

    print("\n🔧 Extracting features...")
    X, y = [], []
    for i, (text, label) in enumerate(data):
        if i % 1000 == 0:
            print(f"   {i}/{len(data)}...")
        X.append(extract_features(text))
        y.append(label)

    X, y = np.array(X), np.array(y)
    print(f"✅ Features shape: {X.shape}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("\n🤖 Training LogisticRegression...")
    model = LogisticRegression(max_iter=1000, C=1.0, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n📊 Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, y_pred, target_names=["Human", "AI"]))

    os.makedirs(os.path.dirname(MODEL_OUTPUT), exist_ok=True)
    joblib.dump(model, MODEL_OUTPUT)
    print(f"✅ Model saved to: {MODEL_OUTPUT}")
    return accuracy


if __name__ == "__main__":
    train()
