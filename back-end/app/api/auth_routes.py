# backend/app/api/auth_routes.py
from fastapi import APIRouter, HTTPException, status, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import UserCreate, UserOut
from app.auth.auth import (
    create_access_token, 
    create_refresh_token, 
    get_password_hash, 
    verify_password,
    create_password_reset_token,
    verify_password_reset_token,
    create_verification_token,
    verify_verification_token,
    SECRET_KEY,
    ALGORITHM
)
from app.models.db import db
from app.utilities.email import send_password_reset_email, send_verification_email
from app.utilities.rate_limiter import limiter
from fastapi import Request, BackgroundTasks
from datetime import datetime
import jwt
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserOut, description="Register a new user account.")
@limiter.limit("5/minute")
async def register(request: Request, user: UserCreate, background_tasks: BackgroundTasks):
    # Check if user exists
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
         raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user.password)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_disabled"] = False
    user_dict["is_verified"] = False # Require email verification
    
    # Insert
    res = await db["users"].insert_one(user_dict)
    new_user = await db["users"].find_one({"_id": res.inserted_id})
    
    # Send verification email
    token = create_verification_token(user.email)
    background_tasks.add_task(send_verification_email, user.email, token)
    
    new_user["id"] = str(new_user["_id"])
    return new_user

@router.post("/verify-email", description="Verify user email using a valid token.")
async def verify_email(token: str = Body(..., embed=True)):
    email = verify_verification_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")
    
    # Check if user exists
    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("is_verified"):
        return {"message": "Email already verified"}
    
    # Update user
    await db["users"].update_one(
        {"email": email},
        {"$set": {"is_verified": True}}
    )
    
    return {"message": "Email verified successfully. You can now log in."}

@router.post("/login", description="Authenticate user and return access/refresh tokens.")
@limiter.limit("10/minute")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    # Find user
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if user.get("is_disabled"):
        raise HTTPException(status_code=403, detail="Account deactivated. Please contact support.")

    if not user.get("is_verified", False):
        raise HTTPException(status_code=403, detail="Please verify your email before logging in.")

    # Create tokens
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})
    
    return {
        "access_token": access_token, 
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user["email"],
            "role": user.get("role", "user")
        }
    }

@router.post("/refresh", description="Refresh access token using a valid refresh token.")
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

@router.post("/forgot-password", description="Request a password reset link.")
@limiter.limit("3/minute")
async def forgot_password(request: Request, background_tasks: BackgroundTasks, email: str = Body(..., embed=True)):
    user = await db["users"].find_one({"email": email})
    if not user:
        # For security reasons, don't reveal if the email exists or not
        return {"message": "If this email is registered, you will receive a reset link shortly."}
    
    token = create_password_reset_token(email)
    background_tasks.add_task(send_password_reset_email, email, token)
    
    return {"message": "If this email is registered, you will receive a reset link shortly."}

@router.post("/reset-password", description="Reset password using a valid reset token.")
async def reset_password(token: str = Body(..., embed=True), new_password: str = Body(..., embed=True)):
    email = verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Validation of password strength could be added here similar to UserCreate
    hashed_password = get_password_hash(new_password)
    
    res = await db["users"].update_one(
        {"email": email},
        {"$set": {"password": hashed_password, "is_verified": True}}
    )
    
    if res.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update password")
        
    return {"message": "Password updated successfully"}
