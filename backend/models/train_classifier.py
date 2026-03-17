import numpy as np
import joblib
import os
import nltk
from datasets import load_dataset
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

nltk.download("punkt_tab", quiet=True)
MODEL_OUTPUT = os.path.join(os.path.dirname(__file__), "model.pkl")

def compute_burstiness(text):
    sentences = nltk.sent_tokenize(text)
    word_counts = [len(s.split()) for s in sentences if s.strip()]
    if len(word_counts) < 2:
        wc = word_counts[0] if word_counts else 10
        return float(min(max((wc - 5) / 35, 0.0), 1.0))
    return float(min(np.std(word_counts) / 15.0, 1.0))

def extract_features(text):
    words = text.split()
    if not words:
        return [0.0] * 8

    # Feature 1: Vocabulary richness (AI has higher unique ratio)
    unique_ratio = len(set(words)) / len(words)

    # Feature 2: Average word length (AI uses longer words)
    avg_word_len = np.mean([len(w) for w in words])

    # Feature 3: Burstiness (human varies sentence length more)
    burstiness = compute_burstiness(text)

    # Feature 4: Punctuation ratio
    punct_ratio = sum(1 for c in text if c in ".,;:!?\"'()-") / max(len(text), 1)

    # Feature 5: Average sentence length
    sentences = nltk.sent_tokenize(text)
    avg_sent_len = np.mean([len(s.split()) for s in sentences]) if sentences else 0

    # Feature 6: Filler words ratio (human uses more fillers)
    fillers = ["honestly", "actually", "basically", "literally", "just", "really", "tbh", "kinda", "sorta", "yeah"]
    filler_ratio = sum(1 for w in words if w.lower() in fillers) / max(len(words), 1)

    # Feature 7: Formal words ratio (AI uses more formal words)
    formal = ["furthermore", "moreover", "consequently", "therefore", "subsequently", "additionally", "nonetheless", "whereby", "thereby", "hence"]
    formal_ratio = sum(1 for w in words if w.lower() in formal) / max(len(words), 1)

    # Feature 8: Contraction usage (human uses more contractions)
    contractions = ["i'm", "it's", "don't", "can't", "won't", "i've", "we're", "they're", "i'd", "you're"]
    contraction_ratio = sum(1 for w in words if w.lower() in contractions) / max(len(words), 1)

    return [unique_ratio, avg_word_len, burstiness, punct_ratio, avg_sent_len, filler_ratio, formal_ratio, contraction_ratio]

def train():
    print("📥 Loading dataset...")
    dataset = load_dataset("artem9k/ai-text-detection-pile", split="train")
    total = len(dataset)

    human_data = []
    ai_data = []

    for item in dataset.select(range(100000)):
        text = item.get("text", "")
        if text and len(text.split()) > 20 and len(human_data) < 5000:
            human_data.append((text.strip(), 0))

    for item in dataset.select(range(total - 100000, total)):
        text = item.get("text", "")
        if text and len(text.split()) > 20 and len(ai_data) < 5000:
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
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("\n🤖 Training...")
    model = Pipeline([
        ('scaler', StandardScaler()),
        ('clf', LogisticRegression(max_iter=1000, C=2.0, random_state=42))
    ])
    model.fit(X_train, y_train)

    accuracy = accuracy_score(y_test, model.predict(X_test))
    print(f"\n📊 Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, model.predict(X_test), target_names=["Human", "AI"]))

    joblib.dump(model, MODEL_OUTPUT)
    print(f"✅ Model saved: {MODEL_OUTPUT}")

if __name__ == "__main__":
    train()
