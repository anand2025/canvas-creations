from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId
from typing import Dict, Any

async def create_order_from_cart_logic(user_id: str, checkout_request: Dict[str, Any], user_email: str, user_name: str) -> Dict[str, Any]:
    """
    Create an order from the user's cart
    
    Args:
        user_id: The user's ID
        checkout_request: Checkout data including shipping address and payment method
        user_email: User's email address
        user_name: User's name
        
    Returns:
        Order response with order details
        
    Raises:
        HTTPException: If cart is empty or order creation fails
    """
    try:
        # Fetch user's cart
        cart = await db["cart"].find_one({"user_id": user_id})
        
        if not cart or not cart.get("items") or len(cart["items"]) == 0:
            raise HTTPException(status_code=400, detail="Cart is empty. Please add items before checkout.")
        
        # Prepare order items with current prices
        order_items = []
        total_price = 0
        
        for item in cart["items"]:
            painting = await db["paintings"].find_one({"_id": ObjectId(item["painting_id"])})
            
            if not painting:
                raise HTTPException(
                    status_code=404, 
                    detail=f"Painting with ID {item['painting_id']} not found"
                )
            
            item_price = painting.get("price", 0)
            item_quantity = item["quantity"]
            item_total = item_price * item_quantity
            
            order_items.append({
                "painting_id": item["painting_id"],
                "quantity": item_quantity,
                "price": item_price
            })
            
            total_price += item_total
        
        # Calculate shipping cost (flat rate for now, can be enhanced)
        shipping_cost = 100 if total_price < 2000 else 0  # Free shipping above ₹2000
        grand_total = total_price + shipping_cost
        
        # Create order document
        order_doc = {
            "user_id": user_id,
            "items": order_items,
            "total_price": total_price,
            "shipping_cost": shipping_cost,
            "grand_total": grand_total,
            "shipping_address": checkout_request["shipping_address"],
            "customer_email": user_email,
            "customer_name": user_name,
            "payment_method": checkout_request["payment_method"],
            "status": "pending",  # pending, confirmed, shipped, delivered, cancelled
            "payment_status": "pending" if checkout_request["payment_method"] != "cod" else "cod",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert order
        result = await db["orders"].insert_one(order_doc)
        order_id = str(result.inserted_id)
        
        # Clear user's cart after successful order
        await db["cart"].update_one(
            {"user_id": user_id},
            {"$set": {"items": [], "updated_at": datetime.utcnow()}}
        )
        
        # Fetch created order
        created_order = await db["orders"].find_one({"_id": result.inserted_id})
        order_data = serialize_doc(created_order)
        
        return {
            "order_id": order_id,
            "status": "success",
            "message": "Order placed successfully!",
            "order_details": order_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


async def get_user_orders_logic(user_id: str):
    """
    Fetch all orders for a specific user
    
    Args:
        user_id: The user's ID
        
    Returns:
        List of user's orders
    """
    try:
        orders = []
        cursor = db["orders"].find({"user_id": user_id}).sort("created_at", -1)
        
        async for order in cursor:
            orders.append(serialize_doc(order))
        
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch orders: {str(e)}")


async def get_order_by_id_logic(order_id: str, user_id: str):
    """
    Fetch a specific order by ID
    
    Args:
        order_id: The order's ID
        user_id: The user's ID (for authorization)
        
    Returns:
        Order details
        
    Raises:
        HTTPException: If order not found or unauthorized
    """
    try:
        order = await db["orders"].find_one({"_id": ObjectId(order_id)})
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Verify order belongs to user
        if order.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized to view this order")
        
        return serialize_doc(order)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch order: {str(e)}")
