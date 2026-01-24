# backend/app/api/auth_routes.py
from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserOut
from app.auth.auth import create_access_token, get_password_hash, verify_password
from app.models.db import db
from datetime import datetime

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
        
    # Create token
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user.get("role", "customer")}
    )
    return {"access_token": access_token, "token_type": "bearer"}
