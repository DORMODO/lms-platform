from pydantic import BaseModel
from typing import Optional


class SearchRequest(BaseModel):
    query: str


class SearchResponse(BaseModel):
    courseIds: list[int]


class CourseIndexEvent(BaseModel):
    event: str
    courseId: int
    title: str
    description: str
    lessons: list[str] = []
