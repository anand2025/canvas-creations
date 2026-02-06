from app.models.db import db
from app.utils import serialize_doc
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

async def create_review_logic(review):
    try:
        review_dict = review.dict()
        
        # Check if user already reviewed this painting
        existing = await db["reviews"].find_one({
            "user_id": review_dict["user_id"],
            "painting_id": review_dict["painting_id"]
        })
        if existing:
            raise HTTPException(status_code=400, detail="You have already reviewed this product")

        # Check if user has purchased the product
        can_review = await check_user_can_review_logic(review_dict["user_id"], review_dict["painting_id"])
        if not can_review:
            raise HTTPException(status_code=403, detail="You must purchase this product before writing a review")

        review_dict["created_at"] = datetime.utcnow()
        res = await db["reviews"].insert_one(review_dict)
        
        # Update painting's rating and num_reviews
        painting_id = review_dict["painting_id"]
        
        # Calculate new average
        pipeline = [
            {"$match": {"painting_id": painting_id}},
            {"$group": {
                "_id": "$painting_id",
                "avgRating": {"$avg": "$rating"},
                "numReviews": {"$sum": 1}
            }}
        ]
        stats = await db["reviews"].aggregate(pipeline).to_list(1)
        
        if stats:
            new_rating = stats[0]["avgRating"]
            num_reviews = stats[0]["numReviews"]
            
            await db["paintings"].update_one(
                {"_id": ObjectId(painting_id)},
                {"$set": {"rating": new_rating, "num_reviews": num_reviews}}
            )

        new_review = await db["reviews"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_review)
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_product_reviews_logic(painting_id: str):
    try:
        reviews = []
        cursor = db["reviews"].find({"painting_id": painting_id}).sort("created_at", -1)
        async for doc in cursor:
            reviews.append(serialize_doc(doc))
        return reviews
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def check_user_can_review_logic(user_id: str, painting_id: str):
    try:
        # User can review if they have a non-cancelled order containing this painting_id
        # We also check if the order status is 'delivered' for a better experience, 
        # but common requirement is just 'purchased'. Let's stick to any non-cancelled order.
        order = await db["orders"].find_one({
            "user_id": user_id,
            "status": {"$ne": "cancelled"},
            "items.painting_id": painting_id
        })
        return True if order else False
    except Exception as e:
        print(f"Error checking review eligibility: {e}")
        return False
