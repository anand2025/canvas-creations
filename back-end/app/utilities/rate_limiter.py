from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse

# Initialize the limiter with IP-based identifier and global default limits
# Default: 30 per minute for all routes
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["30/minute"]
)

def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """
    Custom handler for rate limit exceeded errors.
    Returns a nice message without revealing specific limits.
    """
    return JSONResponse(
        status_code=429,
        content={"error": "Too many requests. Please try again later."}
    )

def init_rate_limiting(app):
    """
    Register the rate limiter and custom handler with the FastAPI application.
    """
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, custom_rate_limit_exceeded_handler)
