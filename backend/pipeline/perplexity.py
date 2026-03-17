<<<<<<< HEAD
"""
perplexity.py
-------------
Computes GPT-2 perplexity for a given sentence.
Lower perplexity → more "predictable" → likely AI-written.
Higher perplexity → more "surprising" → likely human-written.
"""

import torch
import math
from transformers import GPT2LMHeadModel, GPT2TokenizerFast

# Load once at module level (cached after first import)
_tokenizer = None
_model = None


def _load_model():
    global _tokenizer, _model
    if _tokenizer is None or _model is None:
        _tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")
        _model = GPT2LMHeadModel.from_pretrained("gpt2")
        _model.eval()
    return _tokenizer, _model


def compute_perplexity(text: str) -> float:
    """
    Returns the GPT-2 perplexity of the input text.
    Clipped to [1, 10000] to avoid extreme outliers.
    """
    tokenizer, model = _load_model()

    encodings = tokenizer(text, return_tensors="pt")
    input_ids = encodings.input_ids

    # Need at least 2 tokens to compute loss
    if input_ids.shape[1] < 2:
        return 500.0  # default uncertain value

    with torch.no_grad():
        outputs = model(input_ids, labels=input_ids)
        loss = outputs.loss  # mean cross-entropy loss

    perplexity = math.exp(loss.item())
    return float(min(max(perplexity, 1.0), 10000.0))


if __name__ == "__main__":
    sample = "The mitochondria is the powerhouse of the cell."
    print(f"Perplexity: {compute_perplexity(sample):.2f}")
=======
import torch
from transformers import GPT2LMHeadModel, GPT2TokenizerFast

print("[perplexity] Loading GPT-2 model...")
tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")
model = GPT2LMHeadModel.from_pretrained("gpt2")
model.eval()
print("[perplexity] GPT-2 ready.")


def get_perplexity(sentence: str) -> float:
    """
    Low perplexity  = AI wrote it (predictable, smooth)
    High perplexity = Human wrote it (varied, surprising)
    """
    encodings = tokenizer(
        sentence,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )
    input_ids = encodings.input_ids

    if input_ids.shape[1] < 2:
        return 500.0

    with torch.no_grad():
        outputs = model(input_ids, labels=input_ids)

    return round(torch.exp(outputs.loss).item(), 2)
>>>>>>> 766e05244e94108eb085ced2ff41d216332d5ee5
