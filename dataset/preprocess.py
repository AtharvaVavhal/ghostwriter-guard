import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("dataset/hc3_raw.csv")

print(f"Total samples: {len(df)}")

# Remove nulls only — no length filter (our samples are already clean)
df = df.dropna()

train, test = train_test_split(
    df,
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)

train.to_csv("dataset/train.csv", index=False)
test.to_csv("dataset/test.csv", index=False)
print(f"Train: {len(train)} samples")
print(f"Test:  {len(test)} samples")