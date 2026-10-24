"""
Entry point for Vercel and local Uvicorn execution.
Exposes the FastAPI `app` instance from `app.main`.
"""

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
