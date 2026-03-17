"""
preprocess.py
-------------
Cleans and splits the raw HC3 dataset into train/test CSV files.
"""

import os
import pandas as pd
from sklearn.model_selection import train_test_split

RAW_PATH = os.path.join(os.path.dirname(__file__), "raw", "hc3_raw.csv")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "processed")


def preprocess():
    print("🔧 Loading raw dataset...")
    df = pd.read_csv(RAW_PATH)
    print(f"   Raw shape: {df.shape}")

    # Label: 1 = AI, 0 = Human
    ai_keywords = ["ai", "gpt", "generated", "llm", "chatgpt", "openai"]
    human_keywords = ["human", "wiki", "reddit", "news", "book", "web"]

    def get_label(source):
        s = str(source).lower()
        if any(k in s for k in ai_keywords):
            return 1
        elif any(k in s for k in human_keywords):
            return 0
        return None

    df["label"] = df["source"].apply(get_label)
    df = df.dropna(subset=["label"])
    df["label"] = df["label"].astype(int)

    # Clean text
    df = df[df["text"].str.split().str.len() > 10]
    df = df.dropna(subset=["text"])
    df["text"] = df["text"].str.strip()

    print(f"   After cleaning: {df.shape}")
    print(f"   Human: {(df['label']==0).sum()} | AI: {(df['label']==1).sum()}")

    # Balance classes
    min_count = min((df['label']==0).sum(), (df['label']==1).sum(), 5000)
    human_df = df[df['label']==0].sample(min_count, random_state=42)
    ai_df = df[df['label']==1].sample(min_count, random_state=42)
    balanced_df = pd.concat([human_df, ai_df]).sample(frac=1, random_state=42)

    # Train/test split
    train_df, test_df = train_test_split(balanced_df, test_size=0.2, random_state=42, stratify=balanced_df['label'])

    # Save
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    train_df.to_csv(os.path.join(OUTPUT_DIR, "train.csv"), index=False)
    test_df.to_csv(os.path.join(OUTPUT_DIR, "test.csv"), index=False)

    print(f"✅ Train: {len(train_df)} | Test: {len(test_df)}")
    print(f"   Saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    preprocess()
