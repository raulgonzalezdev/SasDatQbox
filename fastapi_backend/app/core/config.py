from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import json


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str):
            # Acepta un string separado por comas y lo convierte en una lista
            return [i.strip() for i in v.split(",")]
        if isinstance(v, list):
            return v
        raise ValueError(v)
    
    PROJECT_NAME: str = "SasDatQbox API"
    DATABASE_URL: str
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    NEXT_PUBLIC_API_URL: str
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: str
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str

settings = Settings()