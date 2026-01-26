from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.auth.auth import get_current_admin
from app.models.db import db
from app.schemas.user import UserOut
from app.schemas.paintings import PaintingCreate, PaintingOut
from app.schemas.order import OrderOut
from app.schemas.payment import PaymentOut
from app.schemas.review import ReviewOut
from bson import ObjectId
from datetime import datetime

router = APIRouter()


# -------------------- Admin-Protected Routes --------------------
@router.get("/users", response_model=list[UserOut], description="Get a list of all users. Admin only.")
async def get_all_users(current_admin: dict = Depends(get_current_admin)):
    try:
        users = []
        cursor = db["users"].find()
        async for user in cursor:
            user["id"] = str(user["_id"])
            user.pop("_id")
            users.append(user)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders", response_model=list[OrderOut], description="Get a list of all orders. Admin only.")
async def get_all_orders(current_admin: dict = Depends(get_current_admin)):
    try:
        orders = []
        cursor = db["orders"].find()
        async for order in cursor:
            order["id"] = str(order["_id"])
            order.pop("_id")
            orders.append(order)
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paintings", response_model=list[PaintingOut], description="Get a list of all paintings. Admin only.")
async def get_all_paintings(current_admin: dict = Depends(get_current_admin)):
    try:
        paintings = []
        cursor = db["paintings"].find()
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            doc.pop("_id")
            paintings.append(doc)
        return paintings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/paintings", response_model=PaintingOut, description="Create a new painting. Admin only.")
async def create_painting(painting: PaintingCreate, current_admin: dict = Depends(get_current_admin)):
    try:
        data = painting.dict()
        data["created_at"] = datetime.utcnow()
        res = await db["paintings"].insert_one(data)
        new = await db["paintings"].find_one({"_id": res.inserted_id})
        new["id"] = str(new["_id"])
        new.pop("_id")
        return new
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/paintings/{id}", description="Update an existing painting by ID. Admin only.")
async def update_painting(id: str, painting: PaintingCreate, current_admin: dict = Depends(get_current_admin)):
    try:
        update_data = painting.dict()
        await db["paintings"].update_one({"_id": ObjectId(id)}, {"$set": update_data})
        updated = await db["paintings"].find_one({"_id": ObjectId(id)})
        updated["id"] = str(updated["_id"])
        updated.pop("_id")
        return updated
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/paintings/{id}", description="Delete a painting by ID. Admin only.")
async def delete_painting(id: str, current_admin: dict = Depends(get_current_admin)):
    try:
        res = await db["paintings"].delete_one({"_id": ObjectId(id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Painting not found")
        return {"message": "Painting deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payments", response_model=list[PaymentOut], description="Get a list of all payments. Admin only.")
async def get_all_payments(current_admin: dict = Depends(get_current_admin)):
    try:
        payments = []
        cursor = db["payments"].find()
        async for payment in cursor:
            payment["id"] = str(payment["_id"])
            payment.pop("_id")
            payments.append(payment)
        return payments
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reviews", response_model=list[ReviewOut], description="Get a list of all reviews. Admin only.")
async def get_all_reviews(current_admin: dict = Depends(get_current_admin)):
    try:
        reviews = []
        cursor = db["reviews"].find()
        async for review in cursor:
            review["id"] = str(review["_id"])
            review.pop("_id")
            reviews.append(review)
        return reviews
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/inventory", response_model=list[PaintingOut], description="View current painting inventory stock. Admin only.")
async def view_inventory(current_admin: dict = Depends(get_current_admin)):
    try:
        paintings = await db["paintings"].find().to_list(100)
        return paintings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching inventory: {e}")

# 2. Update stock of a specific painting
@router.post("/inventory/{painting_id}", response_model=PaintingOut, description="Update stock of a specific painting. Admin only.")
async def update_inventory(painting_id: str, stock: int, current_admin: dict = Depends(get_current_admin)):
    try:
        # Check if the painting exists
        painting = await db["paintings"].find_one({"_id": ObjectId(painting_id)})
        if not painting:
            raise HTTPException(status_code=404, detail="Painting not found")
        
        # Update stock
        updated_painting = await db["paintings"].find_one_and_update(
            {"_id": ObjectId(painting_id)},
            {"$set": {"stock": stock}},
            return_document=True
        )
        return updated_painting
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating inventory: {e}")

# 3. Increase/Decrease stock after an order
@router.put("/inventory/{painting_id}", response_model=PaintingOut, description="Adjust stock (increase/decrease) of a specific painting. Admin only.")
async def adjust_inventory(painting_id: str, quantity: int, current_admin: dict = Depends(get_current_admin)):
    try:
        # Check if the painting exists
        painting = await db["paintings"].find_one({"_id": ObjectId(painting_id)})
        if not painting:
            raise HTTPException(status_code=404, detail="Painting not found")
        
        # Adjust stock
        new_stock = painting['stock'] + quantity
        if new_stock < 0:
            raise HTTPException(status_code=400, detail="Not enough stock")
        
        updated_painting = await db["paintings"].find_one_and_update(
            {"_id": ObjectId(painting_id)},
            {"$set": {"stock": new_stock}},
            return_document=True
        )
        return updated_painting
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adjusting inventory: {e}")

@router.put("/orders/{order_id}/status", response_model=OrderOut, description="Update status of an order. Admin only.")
async def update_order_status(order_id: str, status: str, current_admin: dict = Depends(get_current_admin)):
    try:
        # Validate status
        valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid order status")
        
        # Check if the order exists
        order = await db["orders"].find_one({"_id": ObjectId(order_id)})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Update the order status
        updated_order = await db["orders"].find_one_and_update(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": status}},
            return_document=True
        )
        return updated_order
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order status: {e}")
