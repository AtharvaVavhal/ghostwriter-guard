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