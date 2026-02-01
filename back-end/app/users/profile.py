from app.models.db import db
from app.utils import serialize_doc
from app.schemas.user import UserUpdate, PasswordChange, UserStats
from app.auth.auth import verify_password, get_password_hash
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

async def get_user_profile_logic(user_id: str):
    """Get complete user profile"""
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove password from response
        user_data = serialize_doc(user)
        user_data.pop("password", None)
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_user_profile_logic(user_id: str, user_update: UserUpdate):
    """Update user profile information"""
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Check if user exists
        existing_user = await db["users"].find_one({"_id": ObjectId(user_id)})
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prepare update data
        update_data = {k: v for k, v in user_update.dict(exclude_unset=True).items()}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Update user
        await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        updated_user = await db["users"].find_one({"_id": ObjectId(user_id)})
        user_data = serialize_doc(updated_user)
        user_data.pop("password", None)
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def change_password_logic(user_id: str, password_change: PasswordChange):
    """Change user password"""
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Get user
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        if not verify_password(password_change.current_password, user["password"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Check if new password is same as current
        if password_change.current_password == password_change.new_password:
            raise HTTPException(status_code=400, detail="New password must be different from current password")
        
        # Hash and update new password
        hashed_password = get_password_hash(password_change.new_password)
        await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": hashed_password}}
        )
        
        return {"message": "Password changed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def upload_profile_image_logic(user_id: str, image_url: str):
    """Update user profile image"""
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Update user profile image
        result = await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"profile_image": image_url}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"message": "Profile image updated successfully", "image_url": image_url}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_user_stats_logic(user_id: str):
    """Get user statistics"""
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Get user to check existence and get created_at
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get all user orders
        orders = []
        cursor = db["orders"].find({"user_id": user_id})
        async for order in cursor:
            orders.append(order)
        
        # Calculate statistics
        total_orders = len(orders)
        total_spent = sum(order.get("grand_total", 0) for order in orders)
        total_items_purchased = sum(
            sum(item.get("quantity", 0) for item in order.get("items", []))
            for order in orders
        )
        
        # Get last order date
        last_order_date = None
        if orders:
            sorted_orders = sorted(orders, key=lambda x: x.get("created_at", datetime.min), reverse=True)
            last_order_date = sorted_orders[0].get("created_at")
        
        stats = UserStats(
            total_orders=total_orders,
            total_spent=round(total_spent, 2),
            total_items_purchased=total_items_purchased,
            member_since=user.get("created_at", datetime.utcnow()),
            last_order_date=last_order_date
        )
        
        return stats
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def deactivate_user_logic(user_id: str):
    """Deactivate user account (logical delete)"""
    try:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID")
        
        # Check if user exists
        user = await db["users"].find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Mark as disabled
        await db["users"].update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_disabled": True}}
        )
        
        return {"message": "Account deactivated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
