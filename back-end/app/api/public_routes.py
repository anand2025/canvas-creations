# backend/app/api/public_routes.py
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserOut
from app.schemas.paintings import PaintingCreate, PaintingOut
from app.schemas.order import OrderCreate, OrderOut
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
async def get_paintings():
    return await get_all_paintings_logic()

@router.get("/paintings/{id}", response_model=PaintingOut, description="Retrieve a specific painting by its ID.")
async def get_painting(id: str):
    return await get_painting_logic(id)

# -------------------- ORDERS --------------------
@router.post("/orders", response_model=OrderOut, description="Create a new order. Requires active user authentication.")
async def create_order(order: OrderCreate, current_user: dict = Depends(get_current_active_user)):
    return await create_order_logic(order)

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
