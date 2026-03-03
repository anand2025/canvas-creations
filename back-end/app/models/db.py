from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv


MONGO_URI = os.getenv("MONGO_URI")  # e.g., mongodb+srv://<user>:<pass>@cluster.mongodb.net/
client = AsyncIOMotorClient(MONGO_URI)
db = client["canvas_creations"]