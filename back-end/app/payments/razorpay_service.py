import razorpay
import os
import hmac
import hashlib
from fastapi import HTTPException, Request
from app.models.db import db
from bson import ObjectId
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

async def create_razorpay_order(order_id: str):
    """
    Create a Razorpay Order for an existing DB order.
    """
    try:
        # Fetch order from DB
        order = await db["orders"].find_one({"_id": ObjectId(order_id)})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Amount in paise (e.g. 500.00 INR -> 50000 paise)
        amount = int(order["grand_total"] * 100)
        
        data = {
            "amount": amount,
            "currency": "INR",
            "receipt": order_id,
            "notes": {
                "order_id": order_id
            }
        }
        
        razorpay_order = client.order.create(data=data)
        
        # Store razorpay_order_id in our DB order for verification later
        await db["orders"].update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"razorpay_order_id": razorpay_order["id"], "updated_at": datetime.utcnow()}}
        )
        
        return razorpay_order
        
    except Exception as e:
        print(f"Razorpay Order Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def verify_razorpay_payment(payment_data: dict):
    """
    Verify the signature returned by Razorpay after successful payment.
    """
    try:
        # Expected signatures
        razorpay_order_id = payment_data.get("razorpay_order_id")
        razorpay_payment_id = payment_data.get("razorpay_payment_id")
        razorpay_signature = payment_data.get("razorpay_signature")
        order_id = payment_data.get("order_id")

        # Verify signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        try:
            client.utility.verify_payment_signature(params_dict)
        except Exception:
            raise HTTPException(status_code=400, detail="Payment verification failed. Invalid signature.")

        # Update order in DB
        await db["orders"].update_one(
            {"_id": ObjectId(order_id)},
            {
                "$set": {
                    "payment_status": "paid",
                    "status": "confirmed",
                    "razorpay_payment_id": razorpay_payment_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {"status": "success", "message": "Payment verified and order confirmed!"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Verification Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
