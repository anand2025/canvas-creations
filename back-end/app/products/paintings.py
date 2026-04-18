from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

async def create_painting_logic(painting):
    try:
        painting_dict = painting.dict()
        painting_dict["created_at"] = datetime.utcnow()
        res = await db["paintings"].insert_one(painting_dict)
        new_painting = await db["paintings"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_painting)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_all_paintings_logic(category: str = None, sort_by: str = None, search: str = None, skip: int = 0, limit: int = 10):
    try:
        paintings = []
        query = {}
        if category and category != "All":
            # Handle case-insensitivity and singular/plural (e.g. "painting" matches "Paintings")
            base_category = category[:-1] if category.lower().endswith('s') else category
            query["category"] = {"$regex": f"^{base_category}s?$", "$options": "i"}
            
        if search:
            # Leverage MongoDB text index for vastly improved search speed
            query["$text"] = {"$search": search}
            
        cursor = db["paintings"].find(query)
        
        # Apply sorting
        if sort_by == "newest":
            cursor = cursor.sort("created_at", -1)
        elif sort_by == "price_asc":
            cursor = cursor.sort("price", 1)
        elif sort_by == "price_desc":
            cursor = cursor.sort("price", -1)
            
        # Apply pagination
        cursor = cursor.skip(skip).limit(limit)
        
        async for doc in cursor:
            paintings.append(serialize_doc(doc))
        return paintings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_painting_logic(id: str):
    try:
        painting = await db["paintings"].find_one({"_id": ObjectId(id)})
        if not painting:
            raise HTTPException(status_code=404, detail="Painting not found")
        return serialize_doc(painting)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
