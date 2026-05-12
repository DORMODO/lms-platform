import os
import pickle
import faiss
import numpy as np
from app.model import EmbeddingModel

INDEX_PATH = "data/index/index.faiss"
META_PATH = "data/index/metadata.pkl"


class IndexManager:
    def __init__(self, index_path: str = INDEX_PATH, meta_path: str = META_PATH):
        self.index_path = index_path
        self.meta_path = meta_path
        self.model = EmbeddingModel()

        self.index = faiss.read_index(index_path)
        with open(meta_path, "rb") as f:
            self.metadata = pickle.load(f)

        self.course_id_map = self._build_course_id_map()

    def _build_course_id_map(self) -> dict[int, int]:
        return {
            idx: m["courseId"]
            for idx, m in enumerate(self.metadata)
            if m.get("courseId") is not None
        }

    def upsert(self, course_id: int, title: str, description: str, lessons: list[str]):
        text = f"Course: {title}. Description: {description}. Lessons: {' '.join(lessons)}."
        embedding = self.model.embed([text]).astype(np.float32)

        self.index.add(embedding)
        new_idx = len(self.metadata)
        self.metadata.append(
            {
                "courseId": course_id,
                "title": title,
                "description": description,
                "lessons": lessons,
                "type": "lms",
            }
        )
        self.course_id_map[new_idx] = course_id

        self._save()

    def search_course_ids(self, query: str, top_k: int = 20) -> list[int]:
        vector = self.model.embed([query])
        scores, indices = self.index.search(vector, top_k)

        course_ids = []
        for idx in indices[0]:
            if idx == -1:
                continue
            cid = self.course_id_map.get(idx)
            if cid is not None and cid not in course_ids:
                course_ids.append(cid)

        return course_ids

    def _save(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "wb") as f:
            pickle.dump(self.metadata, f)
