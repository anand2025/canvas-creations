from app.models.db import db
import logging

logger = logging.getLogger(__name__)

async def init_indexes():
    """Create necessary MongoDB indexes for performance optimization."""
    try:
        # Paintings collection
        # Text index for search ($text)
        await db["paintings"].create_index([("title", "text"), ("description", "text")], name="title_desc_text")
        
        # Regular indexes for filtering/sorting
        await db["paintings"].create_index("category")
        await db["paintings"].create_index("is_bestseller")
        await db["paintings"].create_index("created_at")
        await db["paintings"].create_index("price")
        
        # Users collection
        await db["users"].create_index("email", unique=True)
        
        # Orders & Reviews collections
        await db["orders"].create_index("user_id")
        await db["reviews"].create_index("product_id")
        
        logger.info("Successfully initialized MongoDB indexes.")
    except Exception as e:
        logger.error(f"Failed to initialize MongoDB indexes: {e}")
