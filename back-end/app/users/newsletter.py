from datetime import datetime
from fastapi import HTTPException
from app.models.db import db
from app.schemas.newsletter import NewsletterCreate, NewsletterOut

async def subscribe_newsletter_logic(newsletter: NewsletterCreate):
    # Check if email already exists
    existing = await db["newsletter_subscriptions"].find_one({"email": newsletter.email})
    if existing:
        raise HTTPException(status_code=400, detail="This email is already subscribed to our newsletter.")
    
    # Create new subscription
    subscription_doc = {
        "email": newsletter.email,
        "subscribed_at": datetime.utcnow()
    }
    
    result = await db["newsletter_subscriptions"].insert_one(subscription_doc)
    
    return {
        "id": str(result.inserted_id),
        "email": newsletter.email,
        "subscribed_at": subscription_doc["subscribed_at"]
    }
