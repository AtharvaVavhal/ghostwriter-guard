"""
download_hc3.py
---------------
Downloads the HC3 (Human ChatGPT Comparison Corpus) from HuggingFace
and saves it locally as CSV files for training.
"""

import os
import pandas as pd
from datasets import load_dataset

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "raw")


def download_hc3():
    print("📥 Downloading AI vs Human dataset from HuggingFace...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    dataset = load_dataset("artem9k/ai-text-detection-pile", split="train")
    print(f"✅ Total rows: {len(dataset)}")

    # Convert to pandas
    df = dataset.to_pandas()
    print(f"   Columns: {list(df.columns)}")
    print(f"   Sources: {df['source'].unique()[:10]}")

    # Save full dataset
    output_path = os.path.join(OUTPUT_DIR, "hc3_raw.csv")
    df.to_csv(output_path, index=False)
    print(f"✅ Saved to: {output_path}")
    print(f"   Shape: {df.shape}")

    return df


if __name__ == "__main__":
    df = download_hc3()
    print("\n📊 Sample:")
    print(df.head(3))
