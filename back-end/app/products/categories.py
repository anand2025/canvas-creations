from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException

async def create_category_logic(category):
    try:
        category_dict = category.dict()
        category_dict["created_at"] = datetime.utcnow()
        res = await db["categories"].insert_one(category_dict)
        new_category = await db["categories"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_categories_logic():
    try:
        categories = []
        cursor = db["categories"].find()
        async for doc in cursor:
            categories.append(serialize_doc(doc))
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
