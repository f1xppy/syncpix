from fastapi import FastAPI, Request
from scapy.layers.l2 import Ether, ARP
from scapy.sendrecv import srp
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app import config
import psycopg2
import logging
import libpcap

logging.basicConfig(filename="log.txt",
                    filemode='a',
                    level = logging.INFO)


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


@app.get("/devices")
async def get_device_list(account_id: int):
    devices = session.query(Device).filter_by(account_id=account_id).all()
    if devices:
        device_list = [int(device_id.__dict__["id"]) for device_id in devices]
        return device_list
    else:
        return {"message": "account not found"}


@app.get("/devices/{id}")
async def get_device_address(id: int):
    device = session.query(Device).filter_by(id=id).first()
    logging.info("123123123123")
    ip_address = device.__dict__["ip"]
    mac_address = device.__dict__["mac"]
    logging.info(ip_address + ' ' + mac_address)
    def check_connection(ip, mac):
        # Создаем ARP-запрос для проверки соединения с устройством
        arp_request = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=ip)
        logging.info(arp_request)
        # Отправляем запрос и получаем ответ
        arp_response = srp(arp_request, timeout=3, verbose=False)[0]
        logging.info(arp_response)
        # Проверяем, получили ли мы ответ
        if arp_response:
            # Проверяем, есть ли в полученных ответах устройство с нужным MAC-адресом
            for packet in arp_response:
                logging.info(packet)
                if packet[1].hwsrc == mac:
                    return 1
        return 0

    return check_connection(ip_address, mac_address)


