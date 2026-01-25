# backend/app/api/auth_routes.py
from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserOut
from app.auth.auth import (
    create_access_token, 
    create_refresh_token, 
    get_password_hash, 
    verify_password,
    SECRET_KEY,
    ALGORITHM
)
from app.models.db import db
from datetime import datetime
import jwt
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
         raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_disabled"] = False
    
    # Insert
    res = await db["users"].insert_one(user_dict)
    new_user = await db["users"].find_one({"_id": res.inserted_id})
    
    new_user["id"] = str(new_user["_id"])
    return new_user

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Find user
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    # Create tokens
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh")
async def refresh(refresh_token: str = Body(..., embed=True)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user or user.get("is_disabled"):
        raise HTTPException(status_code=401, detail="User not found or disabled")
        
    new_access_token = create_access_token(data={"sub": user_id})
    return {"access_token": new_access_token, "token_type": "bearer"}
