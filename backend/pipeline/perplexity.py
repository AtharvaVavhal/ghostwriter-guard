"""
perplexity.py - Lightweight proxy for deployment (no torch required)
"""
import re

def compute_perplexity(text: str) -> float:
    words = text.split()
    if not words:
        return 500.0
    unique_ratio = len(set(words)) / len(words)
    avg_len = sum(len(w) for w in words) / len(words)
    sentences = re.split(r'[.!?]+', text)
    avg_sent_len = len(words) / max(len(sentences), 1)
    perplexity = (1 - unique_ratio) * 100 + avg_len * 5 + (1 / max(avg_sent_len, 1)) * 50
    return float(min(max(perplexity, 1.0), 10000.0))
