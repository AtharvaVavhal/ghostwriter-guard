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

def compute_burstiness(text):
    sentences = nltk.sent_tokenize(text)
    word_counts = [len(s.split()) for s in sentences if s.strip()]
    if len(word_counts) < 2:
        wc = word_counts[0] if word_counts else 10
        return float(min(max((wc - 5) / 35, 0.0), 1.0))
    return float(min(np.std(word_counts) / 15.0, 1.0))

def compute_perplexity_proxy(text):
    words = text.split()
    if not words:
        return 100.0
    unique_ratio = len(set(words)) / len(words)
    avg_len = np.mean([len(w) for w in words])
    return float(100.0 * (1 - unique_ratio) + avg_len * 5)

def extract_features(text):
    words = text.split()
    avg_word_len = float(np.mean([len(w) for w in words])) if words else 0.0
    punct_ratio = sum(1 for c in text if c in ".,;:!?\"'()-") / max(len(text), 1)
    return [compute_perplexity_proxy(text), compute_burstiness(text), avg_word_len, punct_ratio]

def train():
    print("📥 Loading dataset...")
    dataset = load_dataset("artem9k/ai-text-detection-pile", split="train")
    total = len(dataset)
    print(f"   Total: {total}")

    # Get 5000 human from start, 5000 AI from end
    human_data = []
    ai_data = []

    for item in dataset.select(range(50000)):
        text = item.get("text", "")
        if text and len(text.split()) > 10 and len(human_data) < 5000:
            human_data.append((text.strip(), 0))

    for item in dataset.select(range(total - 50000, total)):
        text = item.get("text", "")
        if text and len(text.split()) > 10 and len(ai_data) < 5000:
            ai_data.append((text.strip(), 1))

    data = human_data + ai_data
    print(f"✅ Human: {len(human_data)} | AI: {len(ai_data)}")

    print("\n🔧 Extracting features...")
    X, y = [], []
    for i, (text, label) in enumerate(data):
        if i % 1000 == 0:
            print(f"   {i}/{len(data)}...")
        X.append(extract_features(text))
        y.append(label)

    X, y = np.array(X), np.array(y)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print("\n🤖 Training...")
    model = LogisticRegression(max_iter=1000, C=1.0, random_state=42)
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))
    print(f"\n📊 Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, model.predict(X_test), target_names=["Human", "AI"]))

    joblib.dump(model, MODEL_OUTPUT)
    print(f"✅ Model saved: {MODEL_OUTPUT}")

if __name__ == "__main__":
    train()
