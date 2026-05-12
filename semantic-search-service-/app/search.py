import faiss
import pickle
import numpy as np
from app.model import EmbeddingModel

class SemanticSearch:
    def __init__(
        self,
        index_path: str = "data/index/index.faiss",
        meta_path: str = "data/index/metadata.pkl",
    ):
        self.model = EmbeddingModel()
        self.index = faiss.read_index(index_path)

        with open(meta_path, "rb") as f:
            self.metadata = pickle.load(f)

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        # 1. embed the query
        vector = self.model.embed([query])

        # 2. search FAISS
        scores, indices = self.index.search(vector, top_k)

        # 3. return results
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            result = self.metadata[idx].copy()
            result["score"] = round(float(score), 4)
            results.append(result)

        return results