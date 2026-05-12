# scripts/build_index.py

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import faiss
import pickle
from app.data_loader import load_data
from app.model import EmbeddingModel

def build_index(
    data_path: str = "data/coursera_course_2024.csv",
    index_path: str = "data/index/index.faiss",
    meta_path: str = "data/index/metadata.pkl",
):
    # 1. load data
    print("Loading data...")
    documents, metadata = load_data(data_path)
    print(f"  {len(documents)} courses loaded")

    # 2. embed
    print("Embedding documents...")
    model = EmbeddingModel()
    embeddings = model.embed(documents)        
    print(f"  embeddings shape: {embeddings.shape}")

    # 3. build FAISS index
    print("Building FAISS index...")
    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)              
    index.add(embeddings)
    print(f"  {index.ntotal} vectors indexed")

    # 4. save
    os.makedirs(os.path.dirname(index_path), exist_ok=True)
    faiss.write_index(index, index_path)
    with open(meta_path, "wb") as f:
        pickle.dump(metadata, f)
    print(f"  saved → {index_path}")
    print(f"  saved → {meta_path}")
    print("Done!")

if __name__ == "__main__":
    build_index()