from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from pathlib import Path
from uuid import uuid4

router = APIRouter()

# Ensure upload directory exists
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload", tags=["Upload"])
async def upload_image(file: UploadFile = File(...)):
    try:
        # Generate unique filename to prevent overwrites
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return the URL (assuming server is serving static files from /static or similar)
        # For now, we return a relative path or full URL if domain is known
        # We need to mount StaticFiles in main.py to serve this
        return {"url": f"http://127.0.0.1:8000/static/{unique_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
