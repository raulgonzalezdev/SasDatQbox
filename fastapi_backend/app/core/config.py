from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256" # Added ALGORITHM
    # Add other settings as needed

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()