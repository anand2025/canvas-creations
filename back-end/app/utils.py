from datetime import datetime, timedelta

def serialize_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc

def serialize_order(order):
    """Standardize order serialization with default values for missing fields."""
    order = serialize_doc(order)
    if not order:
        return None
    
    # Ensure safe defaults for older data or consistent structure
    if "shipping_cost" not in order:
        order["shipping_cost"] = 0.0
    if "grand_total" not in order:
        order["grand_total"] = order.get("total_price", 0) + order["shipping_cost"]
    if "payment_status" not in order:
        order["payment_status"] = "pending"
    if "created_at" not in order:
        order["created_at"] = None
    if "user_id" not in order:
        order["user_id"] = "guest"
    if "customer_email" not in order:
        order["customer_email"] = "N/A"
    if "customer_name" not in order:
        order["customer_name"] = "Guest"
    if "payment_method" not in order:
        order["payment_method"] = "N/A"
    if "shipping_address" not in order:
        order["shipping_address"] = {
            "full_name": order.get("customer_name", "Guest"),
            "phone": "N/A",
            "address_line1": "N/A",
            "city": "N/A",
            "state": "N/A",
            "postal_code": "N/A",
            "country": "India"
        }
    return order

def get_date_filter(time_range: str):
    """Generate MongoDB date filter based on time range string."""
    if not time_range or time_range == "all":
        return None
    
    now = datetime.utcnow()
    if time_range == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif time_range == "7days":
        start_date = now - timedelta(days=7)
    elif time_range == "30days":
        start_date = now - timedelta(days=30)
    else:
        return None
        
    return {"$gte": start_date}
