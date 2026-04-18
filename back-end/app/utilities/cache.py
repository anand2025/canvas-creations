import time
from functools import wraps

def alru_cache(ttl: int = 300):
    """
    Very simple asynchronous TTL cache decorator.
    Default TTL is 300 seconds (5 minutes).
    """
    def decorator(func):
        cache = {}
        
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create a simple hash key
            key = str(args) + str(kwargs)
            now = time.time()
            
            if key in cache:
                value, timestamp = cache[key]
                if now - timestamp < ttl:
                    return value
            
            # Cache miss or expired
            result = await func(*args, **kwargs)
            cache[key] = (result, now)
            return result
            
        return wrapper
    return decorator
