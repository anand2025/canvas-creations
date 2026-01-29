# backend/app/api/public_routes.py
from fastapi import APIRouter, HTTPException, Depends
from app.models.db import db
from app.schemas.user import UserCreate, UserOut
from app.schemas.paintings import PaintingCreate, PaintingOut
from app.schemas.order import OrderCreate, OrderOut, CheckoutRequest, OrderResponse
from app.schemas.review import ReviewCreate, ReviewOut
from app.schemas.cart import CartCreate, AddToCartItem, UpdateCartItem
from app.schemas.payment import PaymentCreate, PaymentOut
from app.schemas.category import CategoryCreate, CategoryOut
from app.schemas.wishlist import WishlistCreate
from app.auth.auth import get_current_active_user

# Import logic functions
from app.users.users import create_user_logic
from app.products.paintings import create_painting_logic, get_all_paintings_logic, get_painting_logic
from app.products.orders import create_order_logic
from app.products.checkout import create_order_from_cart_logic, get_user_orders_logic, get_order_by_id_logic
from app.products.reviews import create_review_logic
from app.products.cart import add_to_cart_logic, remove_from_cart_logic, update_cart_quantity_logic, get_cart_logic, clear_cart_logic
from app.payments.payments import create_payment_logic
from app.products.categories import create_category_logic, get_categories_logic
from app.products.wishlist import update_wishlist_logic, get_wishlist_logic, get_wishlist_items_logic

router = APIRouter()

# -------------------- USERS --------------------
@router.post("/users", response_model=UserOut, description="Register a new user.")
async def create_user(user: UserCreate):
    return await create_user_logic(user)

# -------------------- PAINTINGS --------------------
@router.post("/paintings", response_model=PaintingOut, description="Create a new painting. Requires active user authentication.")
async def create_painting(painting: PaintingCreate, current_user: dict = Depends(get_current_active_user)):
    return await create_painting_logic(painting)

@router.get("/paintings", response_model=list[PaintingOut], description="Retrieve a list of all paintings.")
async def get_paintings(category: str = None, sort_by: str = None):
    return await get_all_paintings_logic(category, sort_by)

@router.get("/paintings/bestsellers", response_model=list[PaintingOut], description="Retrieve a list of bestseller paintings.")
async def get_bestsellers():
    try:
        paintings = []
        # Filter where is_bestseller is true
        cursor = db["paintings"].find({"is_bestseller": True})
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            doc.pop("_id")
            paintings.append(doc)
        return paintings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paintings/{id}", response_model=PaintingOut, description="Retrieve a specific painting by its ID.")
async def get_painting(id: str):
    return await get_painting_logic(id)

# -------------------- ORDERS --------------------
@router.post("/orders", response_model=OrderOut, description="Create a new order. Requires active user authentication.")
async def create_order(order: OrderCreate, current_user: dict = Depends(get_current_active_user)):
    return await create_order_logic(order)

# -------------------- CHECKOUT --------------------
@router.post("/checkout", response_model=OrderResponse, description="Create an order from cart. Requires active user authentication.")
async def checkout(checkout_request: CheckoutRequest, current_user: dict = Depends(get_current_active_user)):
    return await create_order_from_cart_logic(
        user_id=current_user["id"],
        checkout_request=checkout_request.dict(),
        user_email=current_user["email"],
        user_name=current_user["name"]
    )

@router.get("/orders/user", response_model=list[OrderOut], description="Get all orders for the current user.")
async def get_user_orders(current_user: dict = Depends(get_current_active_user)):
    return await get_user_orders_logic(current_user["id"])

@router.get("/orders/{order_id}", response_model=OrderOut, description="Get a specific order by ID.")
async def get_order(order_id: str, current_user: dict = Depends(get_current_active_user)):
    return await get_order_by_id_logic(order_id, current_user["id"])

# -------------------- REVIEWS --------------------
@router.post("/reviews", response_model=ReviewOut, description="Submit a review for a product. Requires active user authentication.")
async def create_review(review: ReviewCreate, current_user: dict = Depends(get_current_active_user)):
    return await create_review_logic(review)

# -------------------- CART --------------------
@router.post("/cart", description="Add an item to the user's shopping cart.")
async def add_to_cart(item: AddToCartItem, current_user: dict = Depends(get_current_active_user)):
    return await add_to_cart_logic(current_user["id"], item)

@router.get("/cart", description="Retrieve the shopping cart for the current user.")
async def get_cart(current_user: dict = Depends(get_current_active_user)):
    return await get_cart_logic(current_user["id"])

@router.put("/cart", description="Update the quantity of an item in the cart.")
async def update_cart_quantity(item: UpdateCartItem, current_user: dict = Depends(get_current_active_user)):
    return await update_cart_quantity_logic(current_user["id"], item)

@router.delete("/cart/{painting_id}", description="Remove an item from the cart.")
async def remove_from_cart(painting_id: str, current_user: dict = Depends(get_current_active_user)):
    return await remove_from_cart_logic(current_user["id"], painting_id)

@router.delete("/cart", description="Clear the user's shopping cart.")
async def clear_cart(current_user: dict = Depends(get_current_active_user)):
    return await clear_cart_logic(current_user["id"])

# -------------------- PAYMENTS --------------------
@router.post("/payments", response_model=PaymentOut, description="Process a payment for an order. Requires active user authentication.")
async def create_payment(payment: PaymentCreate, current_user: dict = Depends(get_current_active_user)):
    return await create_payment_logic(payment)

# -------------------- CATEGORIES --------------------
@router.post("/categories", response_model=CategoryOut, description="Create a new painting category. Requires active user authentication.")
async def create_category(category: CategoryCreate, current_user: dict = Depends(get_current_active_user)):
    return await create_category_logic(category)

@router.get("/categories", response_model=list[CategoryOut], description="Retrieve a list of all painting categories.")
async def get_categories():
    return await get_categories_logic()

# -------------------- WISHLIST --------------------
@router.post("/wishlist", description="Update the user's wishlist. Requires active user authentication.")
async def update_wishlist(wishlist: WishlistCreate, current_user: dict = Depends(get_current_active_user)):
    return await update_wishlist_logic(wishlist)

@router.get("/wishlist", description="Retrieve the wishlist for a specific user. Requires active user authentication.")
async def get_wishlist(current_user: dict = Depends(get_current_active_user)):
    return await get_wishlist_logic(current_user["id"])

@router.get("/wishlist/items", response_model=list[PaintingOut], description="Retrieve full details for all items in a user's wishlist.")
async def get_wishlist_items(current_user: dict = Depends(get_current_active_user)):
    return await get_wishlist_items_logic(current_user["id"])
