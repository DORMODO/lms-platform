import os
import logging
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.search import SemanticSearch
from app.index_manager import IndexManager
from app.eureka_client import register_with_eureka
from app.models import SearchRequest, CourseIndexEvent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

searcher = None
index_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global searcher, index_manager

    searcher = SemanticSearch()
    index_manager = IndexManager()

    register_with_eureka()

    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "Semantic Search API is running"}

@app.get("/search")
def search(query: str, top_k: int = 5):
    results = searcher.search(query, top_k)
    return {
        "query": query,
        "total": len(results),
        "results": results
    }

@app.post("/api/nlu/search")
def semantic_search(request: SearchRequest):
    try:
        results = searcher.search(request.query, top_k=20)
        return {"results": results}
    except Exception as e:
        logger.error("Search failed: %s", e, exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "Internal search error", "results": []},
        )

@app.post("/api/nlu/index")
def index_course(event: CourseIndexEvent):
    try:
        index_manager.upsert(
            course_id=event.courseId,
            title=event.title,
            description=event.description,
            lessons=event.lessons,
        )
        return {"status": "indexed", "courseId": event.courseId}
    except Exception as e:
        logger.error("Indexing failed: %s", e, exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "Internal indexing error"},
        )
