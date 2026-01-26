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

async def get_all_paintings_logic():
    try:
        paintings = []
        cursor = db["paintings"].find()
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
