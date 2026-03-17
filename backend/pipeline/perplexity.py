import torch
import math
from transformers import GPT2LMHeadModel, GPT2TokenizerFast

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
    tokenizer, model = _load_model()
    encodings = tokenizer(text, return_tensors="pt")
    input_ids = encodings.input_ids
    if input_ids.shape[1] < 2:
        return 500.0
    with torch.no_grad():
        outputs = model(input_ids, labels=input_ids)
        loss = outputs.loss
    perplexity = math.exp(loss.item())
    return float(min(max(perplexity, 1.0), 10000.0))
