from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException

async def create_payment_logic(payment):
    try:
        payment_dict = payment.dict()
        payment_dict["created_at"] = datetime.utcnow()
        res = await db["payments"].insert_one(payment_dict)
        new_payment = await db["payments"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_payment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
