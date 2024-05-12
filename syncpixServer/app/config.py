from pydantic import Field
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    postgres_dsn: str = Field(
        default='postgresql+psycopg2://postgres:123@localhost:5432/postgres',
        env='POSTGRES_DSN',
        alias='POSTGRES_DSN'
    )

    class Config:
        env_file = ".env"


def load_config():
    app_config: Config = Config()
    return app_config
