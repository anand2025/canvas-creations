# backend/app/api/public_routes.py
from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserOut
from app.schemas.paintings import PaintingCreate, PaintingOut
from app.schemas.order import OrderCreate, OrderOut
from app.schemas.review import ReviewCreate, ReviewOut
from app.schemas.cart import CartCreate
from app.schemas.payment import PaymentCreate, PaymentOut
from app.schemas.category import CategoryCreate, CategoryOut
from app.schemas.wishlist import WishlistCreate
from app.models.db import db
from app.auth.auth import get_password_hash, get_current_active_user
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId

router = APIRouter()

def serialize_doc(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc

# -------------------- USERS --------------------
@router.post("/users", response_model=UserOut)
async def create_user(user: UserCreate):
    try:
        existing = await db["users"].find_one({"email": user.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        user_dict = user.dict()
        user_dict["password"] = get_password_hash(user.password)
        user_dict["created_at"] = datetime.utcnow()
        res = await db["users"].insert_one(user_dict)
        new_user = await db["users"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- PAINTINGS (Protected Creation) --------------------
@router.post("/paintings", response_model=PaintingOut)
async def create_painting(painting: PaintingCreate, current_user: dict = Depends(get_current_active_user)):
    try:
        painting_dict = painting.dict()
        painting_dict["created_at"] = datetime.utcnow()
        res = await db["paintings"].insert_one(painting_dict)
        new_painting = await db["paintings"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_painting)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paintings", response_model=list[PaintingOut])
async def get_all_paintings():
    try:
        paintings = []
        cursor = db["paintings"].find()
        async for doc in cursor:
            paintings.append(serialize_doc(doc))
        return paintings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paintings/{id}", response_model=PaintingOut)
async def get_painting(id: str):
    try:
        painting = await db["paintings"].find_one({"_id": ObjectId(id)})
        if not painting:
            raise HTTPException(status_code=404, detail="Painting not found")
        return serialize_doc(painting)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- ORDERS --------------------
@router.post("/orders", response_model=OrderOut)
async def create_order(order: OrderCreate, current_user: dict = Depends(get_current_active_user)):
    try:
        order_dict = order.dict()
        order_dict["created_at"] = datetime.utcnow()
        order_dict["status"] = "pending"
        order_dict["payment_status"] = "pending"
        res = await db["orders"].insert_one(order_dict)
        new_order = await db["orders"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- REVIEWS --------------------
@router.post("/reviews", response_model=ReviewOut)
async def create_review(review: ReviewCreate, current_user: dict = Depends(get_current_active_user)):
    try:
        review_dict = review.dict()
        review_dict["created_at"] = datetime.utcnow()
        res = await db["reviews"].insert_one(review_dict)
        new_review = await db["reviews"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_review)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- CART --------------------
@router.post("/cart")
async def update_cart(cart: CartCreate, current_user: dict = Depends(get_current_active_user)):
    try:
        await db["cart"].delete_one({"user_id": cart.user_id})
        cart_dict = cart.dict()
        cart_dict["created_at"] = datetime.utcnow()
        await db["cart"].insert_one(cart_dict)
        return {"message": "Cart updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cart/{user_id}")
async def get_cart(user_id: str, current_user: dict = Depends(get_current_active_user)):
    try:
        cart = await db["cart"].find_one({"user_id": user_id})
        if cart:
            return serialize_doc(cart)
        return {"message": "Cart is empty"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- PAYMENTS --------------------
@router.post("/payments", response_model=PaymentOut)
async def create_payment(payment: PaymentCreate, current_user: dict = Depends(get_current_active_user)):
    try:
        payment_dict = payment.dict()
        payment_dict["created_at"] = datetime.utcnow()
        res = await db["payments"].insert_one(payment_dict)
        new_payment = await db["payments"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_payment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- CATEGORIES --------------------
@router.post("/categories", response_model=CategoryOut)
async def create_category(category: CategoryCreate, current_user: dict = Depends(get_current_active_user)):
    try:
        category_dict = category.dict()
        category_dict["created_at"] = datetime.utcnow()
        res = await db["categories"].insert_one(category_dict)
        new_category = await db["categories"].find_one({"_id": res.inserted_id})
        return serialize_doc(new_category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories", response_model=list[CategoryOut])
async def get_categories():
    try:
        categories = []
        cursor = db["categories"].find()
        async for doc in cursor:
            categories.append(serialize_doc(doc))
        return categories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------- WISHLIST --------------------
@router.post("/wishlist")
async def update_wishlist(wishlist: WishlistCreate, current_user: dict = Depends(get_current_active_user)):
    try:
        await db["wishlist"].delete_one({"user_id": wishlist.user_id})
        wishlist_dict = wishlist.dict()
        wishlist_dict["created_at"] = datetime.utcnow()
        await db["wishlist"].insert_one(wishlist_dict)
        return {"message": "Wishlist updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/wishlist/{user_id}")
async def get_wishlist(user_id: str, current_user: dict = Depends(get_current_active_user)):
    try:
        wishlist = await db["wishlist"].find_one({"user_id": user_id})
        if wishlist:
            return serialize_doc(wishlist)
        return {"message": "Wishlist is empty"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
