from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.public_routes import router as public_router
from app.api.auth_routes import router as auth_router
from app.api.admin_routes import router as admin_router

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

# include routers
app.include_router(public_router, tags=["Public"])
app.include_router(auth_router)
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
