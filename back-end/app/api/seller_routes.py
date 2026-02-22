from fastapi import APIRouter, HTTPException, Depends, status, Request
from app.utilities.rate_limiter import limiter
from app.auth.auth import get_current_seller
from app.models.db import db
from app.schemas.paintings import PaintingCreate, PaintingOut
from app.schemas.order import OrderOut, PaginatedOrdersResponse
from app.schemas.review import ReviewOut
from app.utils import serialize_doc, serialize_order, get_date_filter
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats", description="Get seller statistics. Seller only.")
async def get_seller_stats(current_seller: dict = Depends(get_current_seller)):
    try:
        seller_id = str(current_seller["id"])
        
        # Total paintings count
        total_paintings = await db["paintings"].count_documents({"seller_id": seller_id})
        
        # To get revenue, we need to iterate through orders and find paintings owned by this seller
        # This is a bit complex in MongoDB without proper denormalization, 
        # but for now we'll do an aggregation or manual filter.
        # Optimized way: pipeline matching seller_id in products list within orders
        
        pipeline = [
            {"$unwind": "$items"},
            {"$match": {"items.seller_id": seller_id}},
            {"$group": {"_id": None, "totalRevenue": {"$sum": {"$multiply": ["$items.price", "$items.quantity"]}}}}
        ]
        revenue_result = await db["orders"].aggregate(pipeline).to_list(1)
        total_revenue = revenue_result[0]["totalRevenue"] if revenue_result else 0
        
        # Count active orders (status not 'delivered' or 'cancelled')
        active_orders = await db["orders"].count_documents({
            "items.seller_id": seller_id,
            "status": {"$nin": ["delivered", "cancelled"]}
        })
        
        return {
            "total_revenue": total_revenue,
            "total_paintings": total_paintings,
            "active_orders": active_orders
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paintings", response_model=list[PaintingOut], description="Get seller's paintings.")
async def get_seller_paintings(current_seller: dict = Depends(get_current_seller)):
    try:
        seller_id = str(current_seller["id"])
        paintings = []
        cursor = db["paintings"].find({"seller_id": seller_id})
        async for doc in cursor:
            paintings.append(serialize_doc(doc))
        return paintings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/paintings", response_model=PaintingOut, description="Create a new painting as a seller.")
@limiter.limit("10/minute")
async def create_seller_painting(request: Request, painting: PaintingCreate, current_seller: dict = Depends(get_current_seller)):
    try:
        data = painting.dict()
        data["seller_id"] = str(current_seller["id"])
        data["created_at"] = datetime.utcnow()
        res = await db["paintings"].insert_one(data)
        new = await db["paintings"].find_one({"_id": res.inserted_id})
        return serialize_doc(new)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/paintings/{id}", response_model=PaintingOut, description="Update seller's painting.")
async def update_seller_painting(id: str, painting: PaintingCreate, current_seller: dict = Depends(get_current_seller)):
    try:
        seller_id = str(current_seller["id"])
        # Check ownership
        existing = await db["paintings"].find_one({"_id": ObjectId(id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Painting not found")
        if existing.get("seller_id") != seller_id and current_seller.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized to update this painting")
            
        update_data = painting.dict()
        update_data["seller_id"] = seller_id # Ensure seller_id doesn't change
        
        await db["paintings"].update_one({"_id": ObjectId(id)}, {"$set": update_data})
        updated = await db["paintings"].find_one({"_id": ObjectId(id)})
        return serialize_doc(updated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/paintings/{id}", description="Delete seller's painting.")
async def delete_seller_painting(id: str, current_seller: dict = Depends(get_current_seller)):
    try:
        seller_id = str(current_seller["id"])
        # Check ownership
        existing = await db["paintings"].find_one({"_id": ObjectId(id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Painting not found")
        if existing.get("seller_id") != seller_id and current_seller.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized to delete this painting")
            
        await db["paintings"].delete_one({"_id": ObjectId(id)})
        return {"message": "Painting deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders", response_model=PaginatedOrdersResponse, description="Get orders containing seller's products.")
async def get_seller_orders(
    page: int = 1,
    limit: int = 10,
    status: str = None,
    time_range: str = "all",
    current_seller: dict = Depends(get_current_seller)
):
    try:
        seller_id = str(current_seller["id"])
        query = {"items.seller_id": seller_id}
        
        if status:
            query["status"] = status
            
        date_filter = get_date_filter(time_range)
        if date_filter:
            query["created_at"] = date_filter

        total_count = await db["orders"].count_documents(query)
        total_pages = (total_count + limit - 1) // limit

        orders = []
        cursor = db["orders"].find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit)
        async for order in cursor:
            orders.append(serialize_order(order))
            
        return {
            "orders": orders,
            "total_count": total_count,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/orders/{order_id}/status", response_model=OrderOut, description="Update status of an order containing seller's products.")
async def update_seller_order_status(order_id: str, status: str, current_seller: dict = Depends(get_current_seller)):
    try:
        seller_id = str(current_seller["id"])
        
        # Validate status
        valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail="Invalid order status")
            
        # Check if the order exists and contains seller's items
        order = await db["orders"].find_one({"_id": ObjectId(order_id), "items.seller_id": seller_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found or access denied")
        
        # Update the order status
        updated_order = await db["orders"].find_one_and_update(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": status}},
            return_document=True
        )
        return serialize_order(updated_order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reviews", response_model=list[ReviewOut], description="Get a list of all reviews for seller's products.")
async def get_seller_reviews(current_seller: dict = Depends(get_current_seller)):
    try:
        seller_id = str(current_seller["id"])
        # Find all painting IDs belonging to this seller
        painting_cursor = db["paintings"].find({"seller_id": seller_id}, {"_id": 1})
        painting_ids = [str(doc["_id"]) async for doc in painting_cursor]
        
        # Find reviews for these paintings
        reviews = []
        cursor = db["reviews"].find({"painting_id": {"$in": painting_ids}}).sort("created_at", -1)
        async for review in cursor:
            review["id"] = str(review["_id"])
            review.pop("_id")
            reviews.append(review)
        return reviews
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reviews/summary", description="Get painting-wise rating summaries for seller's products.")
async def get_seller_reviews_summary(current_seller: dict = Depends(get_current_seller)):
    try:
        seller_id = str(current_seller["id"])
        # Find all painting IDs belonging to this seller
        painting_cursor = db["paintings"].find({"seller_id": seller_id}, {"_id": 1})
        painting_ids = [str(doc["_id"]) async for doc in painting_cursor]
        
        pipeline = [
            {"$match": {"painting_id": {"$in": painting_ids}}},
            {"$group": {
                "_id": "$painting_id",
                "avgRating": {"$avg": "$rating"},
                "count": {"$sum": 1}
            }}
        ]
        summaries = await db["reviews"].aggregate(pipeline).to_list(None)
        
        # Link with painting titles
        result = []
        for s in summaries:
            painting = await db["paintings"].find_one({"_id": ObjectId(s["_id"])})
            result.append({
                "painting_id": s["_id"],
                "title": painting["title"] if painting else "Unknown Product",
                "avg_rating": round(s["avgRating"], 1),
                "review_count": s["count"]
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
