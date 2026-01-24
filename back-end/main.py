from fastapi import FastAPI
from app.api.public_routes import router as public_router
from app.api.auth_routes import router as auth_router
from app.api.admin_routes import router as admin_router

app = FastAPI()

# include routers
app.include_router(public_router, tags=["Public"])
app.include_router(auth_router)
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
