from fastapi import FastAPI
from app.api.public_routes import router as public_router

app = FastAPI()

# include routers
app.include_router(public_router, tags=["Public"])
