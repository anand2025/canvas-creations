# backend/app/auth/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional, List
import hashlib
import os
import jwt
from app.models.db import db
from bson import ObjectId
from app.schemas.user import UserRole
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    # In a real production app, this should crash the app. 
    # For local dev, we can fallback, but let's be strict as requested.
    raise RuntimeError("JWT_SECRET_KEY must be set in the .env file")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 360
REFRESH_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_password_reset_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode = {"exp": expire, "sub": email, "type": "password_reset"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password_reset_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "password_reset":
            return None
        return email
    except jwt.ExpiredSignatureError:
        return None
    except jwt.PyJWTError:
        return None

def create_verification_token(email: str):
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode = {"exp": expire, "sub": email, "type": "email_verification"}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_verification_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "email_verification":
            return None
        return email
    except jwt.ExpiredSignatureError:
        return None
    except jwt.PyJWTError:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "access":
            raise credentials_exception
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db["users"].find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise credentials_exception
    
    user["id"] = str(user["_id"])
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    if current_user.get("is_disabled"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is disabled")
    return current_user

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: dict = Depends(get_current_active_user)):
        user_role = user.get("role")
        if user_role not in self.allowed_roles:
             raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Operation not permitted. Required roles: {[r.value for r in self.allowed_roles]}"
            )
        return user

# Specific Role Dependencies
get_current_admin = RoleChecker([UserRole.ADMIN])
get_current_seller = RoleChecker([UserRole.SELLER, UserRole.ADMIN])
get_current_customer = RoleChecker([UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN])