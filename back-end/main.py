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

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
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
