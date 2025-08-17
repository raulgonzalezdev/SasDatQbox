from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256" # Added ALGORITHM
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # Add other settings as needed

    model_config = SettingsConfigDict(env_file="d:\\SasDatQbox\\fastapi_backend\\.env", extra="ignore")

settings = Settings()