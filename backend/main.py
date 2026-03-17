from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import analyze

app = FastAPI(
    title="GhostWriter Guard API",
    description="AI text detection for academic integrity. Detects AI-written assignments sentence by sentence.",
    version="1.0.0",
)

# Allow frontend (React dev server) to call this API
app.add_middleware(
    CORSMiddleware,
   allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])


@app.get("/")
def root():
    return {"message": "GhostWriter Guard API is running. Visit /docs for Swagger UI."}


@app.get("/health")
def health():
    return {"status": "ok"}
