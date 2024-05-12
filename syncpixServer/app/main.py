from fastapi import FastAPI, Request
from sqlalchemy import Column, Integer, String, create_engine
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
        ip=client_host
    )
    session.add(db_request)
    session.commit()
    return {"message": "device saved"}

@app.put("/devices/{id}")
async def update_device_address(id:int, request: Request):
    device_to_update = session.query(Device).filter_by(id=id).first()
    if device_to_update:
        device_to_update.ip = request.client.host
        session.commit()
        return {"message": "address updated"}
    else:
        return {"message": "device not found"}

@app.get("/devices/{id}")
async def get_device_list(account_id: int):
    devices = session.query(Device).filter_by(account_id=account_id).all()
    if devices:
        device_list = [int(device_id.__dict__["id"]) for device_id in devices]
        return device_list
    else:
        return {"message": "account not found"}

