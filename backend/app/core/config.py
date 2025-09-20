import os
from typing import Optional

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sweetshop.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sweet-shop-secret-key-for-development-only")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

settings = Settings()