from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException

async def update_cart_logic(cart):
    try:
        await db["cart"].delete_one({"user_id": cart.user_id})
        cart_dict = cart.dict()
        cart_dict["created_at"] = datetime.utcnow()
        await db["cart"].insert_one(cart_dict)
        return {"message": "Cart updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_cart_logic(user_id: str):
    try:
        cart = await db["cart"].find_one({"user_id": user_id})
        if cart:
            return serialize_doc(cart)
        return {"message": "Cart is empty"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
