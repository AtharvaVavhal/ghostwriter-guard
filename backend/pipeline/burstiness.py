<<<<<<< HEAD
"""
burstiness.py
-------------
Computes burstiness of text as the standard deviation of word counts per sentence.
Human writing tends to vary sentence length more (high burstiness).
AI writing tends to be more uniform (low burstiness).

For a single sentence, returns the sentence's word count normalized against
a typical human range.
"""

import nltk
import numpy as np

nltk.download("punkt", quiet=True)


def compute_burstiness(text: str) -> float:
    """
    Returns a burstiness score in [0, 1].
    - Close to 0 → uniform sentence lengths → likely AI
    - Close to 1 → highly varied sentence lengths → likely human

    For single sentences, uses word count relative to typical human range (5–40 words).
    For multi-sentence text, uses std dev of sentence word counts.
    """
    sentences = nltk.sent_tokenize(text)
    word_counts = [len(s.split()) for s in sentences if s.strip()]

    if not word_counts:
        return 0.5  # uncertain

    if len(word_counts) == 1:
        # Single sentence: normalize word count (5–40 word range)
        wc = word_counts[0]
        normalized = (wc - 5) / (40 - 5)
        return float(min(max(normalized, 0.0), 1.0))

    std_dev = float(np.std(word_counts))

    # Normalize: std dev of 0 → score 0 (uniform/AI), std dev ≥ 15 → score 1 (varied/human)
    score = std_dev / 15.0
    return float(min(max(score, 0.0), 1.0))


if __name__ == "__main__":
    ai_text = "The sky is blue. The sun is bright. The day is warm. The air is clear."
    human_text = "I woke up late. It was one of those mornings where everything felt slightly off — the kind that makes you wonder if you've made a terrible mistake somewhere, though you can't quite place where. Coffee helped."

    print(f"AI text burstiness:    {compute_burstiness(ai_text):.4f}")
    print(f"Human text burstiness: {compute_burstiness(human_text):.4f}")
=======
import spacy
import numpy as np

nlp = spacy.load("en_core_web_sm")


def get_burstiness(text: str) -> float:
    """
    Humans write with uneven sentence lengths (high std dev).
    AI writes uniformly smooth sentences (low std dev).
    Returns 0.0 - 1.0: higher = more human-like variation.
    """
    doc = nlp(text)
    lengths = [len(sent.text.split()) for sent in doc.sents]

    if len(lengths) < 2:
        return 0.5

    mean = np.mean(lengths)
    std = np.std(lengths)
    burstiness = std / mean if mean > 0 else 0.0

    return round(min(1.0, burstiness / 1.5), 2)
>>>>>>> 766e05244e94108eb085ced2ff41d216332d5ee5
