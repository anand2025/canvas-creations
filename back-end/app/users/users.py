from app.models.db import db
from app.auth.auth import get_password_hash
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException

async def create_user_logic(user):
    try:
        existing = await db["users"].find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        user_dict = user.dict()
        user_dict["password"] = get_password_hash(user.password)
        user_dict["created_at"] = datetime.utcnow()
        res = await db["users"].insert_one(user_dict)
        new_user = await db["users"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_user)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
