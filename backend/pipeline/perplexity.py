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