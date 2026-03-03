import os
from dotenv import load_dotenv

# Load environment variables at the very start
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.public_routes import router as public_router
from app.api.auth_routes import router as auth_router
from app.api.admin_routes import router as admin_router
from app.api.seller_routes import router as seller_router
from app.utilities.rate_limiter import init_rate_limiting
from slowapi.middleware import SlowAPIMiddleware

app = FastAPI()

# Initialize rate limiting
init_rate_limiting(app)
app.add_middleware(SlowAPIMiddleware)

# Add CORS middleware with robust parsing
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001")
# Strip whitespace and trailing slashes to prevent common configuration errors
cors_origins = [o.strip().rstrip("/") for o in raw_origins.split(",") if o.strip()]

# If "*" is in origins, handle it based on credentials requirement
allow_all = "*" in cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if not allow_all else ["*"],
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
from app.api.upload_routes import router as upload_router

# Simple health check to verify API connectivity
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is reachable"}

app.mount("/static", StaticFiles(directory="uploads"), name="static")

# include routers
app.include_router(public_router, tags=["Public"])
app.include_router(auth_router)
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(seller_router, prefix="/seller", tags=["Seller"])
app.include_router(upload_router, prefix="/api", tags=["Upload"])

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
