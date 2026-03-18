from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
import shutil
import os
from pathlib import Path
from uuid import uuid4
from app.auth.auth import get_current_active_user

router = APIRouter()

# Ensure upload directory exists
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

@router.post("/upload", tags=["Upload"])
async def upload_image(
    request: Request,
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_active_user)
):
    try:
        # Validate file extension
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # Generate unique filename to prevent overwrites
        unique_filename = f"{uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file and check size
        size = 0
        with open(file_path, "wb") as buffer:
            # We read in chunks to avoid memory issues and check size
            while chunk := await file.read(1024 * 1024): # 1MB chunks
                size += len(chunk)
                if size > MAX_FILE_SIZE:
                    buffer.close()
                    os.remove(file_path) # Delete partial file
                    raise HTTPException(status_code=400, detail="File too large (max 5MB)")
                buffer.write(chunk)
            
        # Use hosted API URL from .env if available, otherwise fallback to request URL
        base_url = os.getenv("API_URL") or os.getenv("NEXT_PUBLIC_API_URL") or str(request.base_url)
        if not base_url.endswith("/"):
            base_url += "/"
            
        return {"url": f"{base_url}static/{unique_filename}"}
    except HTTPException:
        raise
    except Exception as e:
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Could not upload file: {str(e)}")
