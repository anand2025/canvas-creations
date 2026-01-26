from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException

async def create_order_logic(order):
    try:
        order_dict = order.dict()
        order_dict["created_at"] = datetime.utcnow()
        order_dict["status"] = "pending"
        order_dict["payment_status"] = "pending"
        res = await db["orders"].insert_one(order_dict)
        new_order = await db["orders"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
