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

# Add CORS middleware
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
from app.api.upload_routes import router as upload_router

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
