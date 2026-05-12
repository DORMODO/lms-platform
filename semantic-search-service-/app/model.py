# app/model.py

import torch
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch.nn.functional as F


class EmbeddingModel:
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)
        self.model.eval()
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model.to(self.device)

    def _mean_pool(self, output, attention_mask):
        token_embeddings = output.last_hidden_state            # (batch, seq, dim)
        mask = attention_mask.unsqueeze(-1).float()            # (batch, seq, 1)
        summed = (token_embeddings * mask).sum(dim=1)          # (batch, dim)
        count = mask.sum(dim=1).clamp(min=1e-9)               # (batch, 1)
        return summed / count                                  # (batch, dim)

    def embed(self, texts: list[str], batch_size: int = 32) -> np.ndarray:
        all_embeddings = []

        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]

            encoded = self.tokenizer(
                batch,
                padding=True,
                truncation=True,
                max_length=512,
                return_tensors="pt"
            ).to(self.device)

            with torch.no_grad():
                output = self.model(**encoded)

            embeddings = self._mean_pool(output, encoded["attention_mask"])
            embeddings = F.normalize(embeddings, p=2, dim=1)  # L2 normalize للـ FAISS
            all_embeddings.append(embeddings.cpu().numpy())

        return np.vstack(all_embeddings).astype(np.float32)