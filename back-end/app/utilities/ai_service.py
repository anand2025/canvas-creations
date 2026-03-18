import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use Gemini 1.5 Flash for speed and free tier efficiency
    model = genai.GenerativeModel('gemini-2.0-flash')
else:
    model = None

async def generate_product_description(title: str, category: str, tags: list = None) -> str:
    """
    Generates a creative and compelling product description using Gemini AI.
    """
    if not model:
        return "AI Service not configured. Please add GEMINI_API_KEY to .env"

    prompt = f"""
    You are an expert copywriter for an art and craft store called 'Canvas & Creations'.
    Your task is to write a compelling, poetic, and professional product description.
    
    Product Title: {title}
    Category: {category}
    {f"Features/Tags: {', '.join(tags)}" if tags else ""}
    
    The description should:
    1. Be engaging and highlight the craftsmanship.
    2. Be between 3-5 sentences.
    3. Use a tone that matches the beauty of handmade art.
    4. Do not include prices or shipping info.
    
    Return only the description text.
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating description: {str(e)}"

async def get_chat_response(message: str, history: list = None) -> str:
    """
    Handles chatbot interaction for the AI Art Assistant.
    """
    if not model:
        return "Chat service not configured."

    system_context = """
    You are 'Aria', the AI Art Assistant for 'Canvas & Creations'. 
    Canvas & Creations is a premium online store selling handmade paintings (Abstract, Landscape, Portrait, Modern, Nature, Pop Art) and paper crafts.
    
    Your goals:
    1. Help customers find the perfect art for their home or as a gift.
    2. Answer questions about different art styles.
    3. Be polite, creative, and inspiring. Use a welcoming, artistic tone.
    4. If someone asks for a price, tell them they can find exact pricing on the product pages.
    5. If they are unsure, suggest checking the 'Abstract' or 'Landscape' categories.
    
    Keep responses concise (2-4 sentences). 
    """

    # Format history if provided
    chat_history = []
    if history:
        for entry in history:
            role = "user" if entry['role'] == 'user' else "model"
            chat_history.append({"role": role, "parts": [entry['content']]})

    chat = model.start_chat(history=chat_history)
    
    try:
        response = chat.send_message(f"{system_context}\n\nUser: {message}")
        return response.text.strip()
    except Exception as e:
        return f"I'm sorry, I'm having a little trouble connecting right now. Error: {str(e)}"
