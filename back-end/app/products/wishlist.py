from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

async def update_wishlist_logic(wishlist):
    try:
        await db["wishlist"].delete_one({"user_id": wishlist.user_id})
        wishlist_dict = wishlist.dict()
        wishlist_dict["created_at"] = datetime.utcnow()
        await db["wishlist"].insert_one(wishlist_dict)
        return {"message": "Wishlist updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_wishlist_logic(user_id):
    try:
        wishlist = await db["wishlist"].find_one({"user_id": user_id})
        if wishlist:
            return serialize_doc(wishlist)
        return {"message": "Wishlist is empty"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_wishlist_items_logic(user_id):
    try:
        wishlist = await db["wishlist"].find_one({"user_id": user_id})
        if not wishlist or not wishlist.get("paintings"):
            return []
        
        painting_ids = [ObjectId(pid) for pid in wishlist["paintings"]]
        cursor = db["paintings"].find({"_id": {"$in": painting_ids}})
        
        paintings = []
        async for doc in cursor:
            paintings.append(serialize_doc(doc))
        
        return paintings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
