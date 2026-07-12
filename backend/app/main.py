from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.core.logging import setup_logging

# Initialize Logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Configure CORS Middleware for frontend communication
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register custom global exceptions
setup_exception_handlers(app)

# Include base API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["status"])
def health_check():
    """Service status health check."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "api_docs_url": f"{settings.API_V1_STR}/docs"
    }
