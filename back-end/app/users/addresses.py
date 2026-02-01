from app.models.db import db
from app.utils import serialize_doc
from app.schemas.address import AddressCreate, AddressUpdate
from datetime import datetime
from fastapi import HTTPException
from bson import ObjectId

async def create_address_logic(user_id: str, address: AddressCreate):
    """Create a new address for a user"""
    try:
        address_dict = address.dict()
        address_dict["user_id"] = user_id
        address_dict["created_at"] = datetime.utcnow()
        address_dict["updated_at"] = datetime.utcnow()
        
        # If this is set as default, unset other defaults of the same type
        if address_dict.get("is_default"):
            await db["addresses"].update_many(
                {
                    "user_id": user_id,
                },
                {"$set": {"is_default": False}}
            )
        
        result = await db["addresses"].insert_one(address_dict)
        new_address = await db["addresses"].find_one({"_id": result.inserted_id})
        return serialize_doc(new_address)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_user_addresses_logic(user_id: str):
    """Get all addresses for a user"""
    try:
        addresses = []
        cursor = db["addresses"].find({"user_id": user_id}).sort("created_at", -1)
        async for doc in cursor:
            addresses.append(serialize_doc(doc))
        return addresses
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_address_by_id_logic(address_id: str, user_id: str):
    """Get a specific address by ID"""
    try:
        if not ObjectId.is_valid(address_id):
            raise HTTPException(status_code=400, detail="Invalid address ID")
        
        address = await db["addresses"].find_one({
            "_id": ObjectId(address_id),
            "user_id": user_id
        })
        
        if not address:
            raise HTTPException(status_code=404, detail="Address not found")
        
        return serialize_doc(address)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_address_logic(address_id: str, user_id: str, address_update: AddressUpdate):
    """Update an existing address"""
    try:
        if not ObjectId.is_valid(address_id):
            raise HTTPException(status_code=400, detail="Invalid address ID")
        
        # Check if address exists and belongs to user
        existing = await db["addresses"].find_one({
            "_id": ObjectId(address_id),
            "user_id": user_id
        })
        
        if not existing:
            raise HTTPException(status_code=404, detail="Address not found")
        
        # Prepare update data
        update_data = {k: v for k, v in address_update.dict(exclude_unset=True).items()}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_data["updated_at"] = datetime.utcnow()
        
        # If setting as default, unset other defaults
        if update_data.get("is_default"):
            address_type = update_data.get("address_type", existing.get("address_type"))
            await db["addresses"].update_many(
                {
                    "user_id": user_id,
                    "_id": {"$ne": ObjectId(address_id)},
                    "address_type": {"$in": [address_type, "both"]}
                },
                {"$set": {"is_default": False}}
            )
        
        # Update the address
        await db["addresses"].update_one(
            {"_id": ObjectId(address_id)},
            {"$set": update_data}
        )
        
        updated_address = await db["addresses"].find_one({"_id": ObjectId(address_id)})
        return serialize_doc(updated_address)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_address_logic(address_id: str, user_id: str):
    """Delete an address"""
    try:
        if not ObjectId.is_valid(address_id):
            raise HTTPException(status_code=400, detail="Invalid address ID")
        
        result = await db["addresses"].delete_one({
            "_id": ObjectId(address_id),
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Address not found")
        
        return {"message": "Address deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def set_default_address_logic(address_id: str, user_id: str):
    """Set an address as default"""
    try:
        if not ObjectId.is_valid(address_id):
            raise HTTPException(status_code=400, detail="Invalid address ID")
        
        # Check if address exists
        address = await db["addresses"].find_one({
            "_id": ObjectId(address_id),
            "user_id": user_id
        })
        
        if not address:
            raise HTTPException(status_code=404, detail="Address not found")
        
        # Unset other defaults of the same type
        await db["addresses"].update_many(
            {
                "user_id": user_id,
                "_id": {"$ne": ObjectId(address_id)}
            },
            {"$set": {"is_default": False}}
        )
        
        # Set this address as default
        await db["addresses"].update_one(
            {"_id": ObjectId(address_id)},
            {"$set": {"is_default": True, "updated_at": datetime.utcnow()}}
        )
        
        updated_address = await db["addresses"].find_one({"_id": ObjectId(address_id)})
        return serialize_doc(updated_address)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
