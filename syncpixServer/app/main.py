from fastapi import FastAPI, Request
from sqlalchemy import Column, Integer, String, create_engine, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app import config
import psycopg2


app_config: config.Config = config.load_config()
engine = create_engine(app_config.postgres_dsn)
Base = declarative_base()


class Device(Base):
    __tablename__ = 'devices'
    id = Column(Integer, primary_key=True, autoincrement=True)
    mac = Column(String)
    account_id = Column(Integer)
    ip = Column(String)
    online = Column(Boolean, default=True)


Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

app = FastAPI()


@app.post("/devices/{id}")
async def add_device(account_id: int, mac: str, request: Request):
    client_host = request.client.host
    db_request = Device(
        mac=mac,
        account_id=account_id,
        ip=client_host,
        online=True
    )
    session.add(db_request)
    session.commit()
    return {"message": "device saved"}
