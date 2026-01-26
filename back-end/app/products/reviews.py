from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException

async def create_review_logic(review):
    try:
        review_dict = review.dict()
        review_dict["created_at"] = datetime.utcnow()
        res = await db["reviews"].insert_one(review_dict)
        new_review = await db["reviews"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_review)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
