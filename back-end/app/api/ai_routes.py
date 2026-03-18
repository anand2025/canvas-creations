from fastapi import APIRouter, HTTPException, Depends
from app.schemas.ai import AIProductDescriptionRequest, AIProductDescriptionResponse, AIChatRequest, AIChatResponse
from app.utilities.ai_service import generate_product_description, get_chat_response
from app.auth.auth import get_current_admin

router = APIRouter()

@router.post("/generate-description", response_model=AIProductDescriptionResponse, description="Generate an AI-powered product description. Admin only.")
async def generate_description(
    request: AIProductDescriptionRequest, 
    current_admin: dict = Depends(get_current_admin)
):
    """
    Endpoint to generate a creative description for a product.
    Requires admin authentication.
    """
    try:
        description = await generate_product_description(
            title=request.title,
            category=request.category,
            tags=request.tags
        )
        return AIProductDescriptionResponse(description=description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate description: {str(e)}")

@router.post("/chat", response_model=AIChatResponse, description="Chat with Aria, the AI Art Assistant.")
async def ai_chat(
    request: AIChatRequest
):
    """
    Public endpoint for customers to chat with the AI assistant.
    """
    try:
        # Convert Pydantic objects to dicts for the service
        history_dicts = [m.dict() for m in request.history] if request.history else []
        response = await get_chat_response(request.message, history_dicts)
        return AIChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
