from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SasDatQbox API"
    DATABASE_URL: str
    SECRET_KEY: str
    API_V1_STR: str = "/api/v1"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Usar .env relativo dentro del contenedor (/usr/src/app/.env) y permitir override por variables de entorno
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()