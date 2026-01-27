from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

async def add_to_cart_logic(user_id: str, item):
    try:
        cart = await db["cart"].find_one({"user_id": user_id})
        if not cart:
            new_cart = {
                "user_id": user_id,
                "items": [{"painting_id": item.painting_id, "quantity": item.quantity}],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db["cart"].insert_one(new_cart)
        else:
            items = cart.get("items", [])
            # Check if painting already in cart
            found = False
            for i in items:
                if i["painting_id"] == item.painting_id:
                    i["quantity"] += item.quantity
                    found = True
                    break
            
            if not found:
                items.append({"painting_id": item.painting_id, "quantity": item.quantity})
            
            await db["cart"].update_one(
                {"user_id": user_id},
                {"$set": {"items": items, "updated_at": datetime.utcnow()}}
            )
        return {"message": "Item added to cart"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def remove_from_cart_logic(user_id: str, painting_id: str):
    try:
        await db["cart"].update_one(
            {"user_id": user_id},
            {"$pull": {"items": {"painting_id": painting_id}}, "$set": {"updated_at": datetime.utcnow()}}
        )
        return {"message": "Item removed from cart"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_cart_quantity_logic(user_id: str, item):
    try:
        await db["cart"].update_one(
            {"user_id": user_id, "items.painting_id": item.painting_id},
            {"$set": {"items.$.quantity": item.quantity, "updated_at": datetime.utcnow()}}
        )
        return {"message": "Cart updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_cart_logic(user_id: str):
    try:
        cart = await db["cart"].find_one({"user_id": user_id})
        if not cart or not cart.get("items"):
            return {"user_id": user_id, "items": [], "total_price": 0}
        
        enriched_items = []
        total_price = 0
        
        for item in cart["items"]:
            painting = await db["paintings"].find_one({"_id": ObjectId(item["painting_id"])})
            if painting:
                painting_data = serialize_doc(painting)
                item_total = painting_data.get("price", 0) * item["quantity"]
                total_price += item_total
                enriched_items.append({
                    **item,
                    "painting_details": painting_data,
                    "item_total": item_total
                })
        
        return {
            "user_id": user_id,
            "items": enriched_items,
            "total_price": total_price,
            "updated_at": cart.get("updated_at")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def clear_cart_logic(user_id: str):
    try:
        await db["cart"].update_one(
            {"user_id": user_id},
            {"$set": {"items": [], "updated_at": datetime.utcnow()}}
        )
        return {"message": "Cart cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
