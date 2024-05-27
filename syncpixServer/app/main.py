from fastapi import FastAPI, HTTPException, Depends, status, Request, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from scapy.layers.l2 import Ether, ARP
from scapy.sendrecv import srp
from sqlalchemy import Column, Integer, String, create_engine, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app import config
import psycopg2
import logging
import libpcap
from pydantic import BaseModel
from typing import Optional
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
import datetime
from fastapi.middleware.cors import CORSMiddleware
import minio
import io


minio_client = minio.Minio(
        '127.0.0.1:9000',
        access_key="syncpix",
        secret_key="syncpixpass",
        secure=False
    )


logging.basicConfig(filename="log.txt",
                    filemode='a',
                    level=logging.INFO)


app_config: config.Config = config.load_config()
engine = create_engine(app_config.postgres_dsn)
Base = declarative_base()

SECRET_KEY = "secret_key"  # Замените на ваш секретный ключ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    username = Column(String)
    hashed_password = Column(String)
    full_name = Column(String)
    disabled = Column(Integer, default=0)


class Device(Base):
    __tablename__ = 'devices'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    account_id = Column(Integer)
    ip = Column(String)

Device.__table__.drop(engine)
User.__table__.drop(engine)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Вы можете указать конкретные домены вместо ["*"]
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, OPTIONS, и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

# Схемы Pydantic
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = None


class UserEdit(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None


class UserInDB(UserCreate):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Вспомогательные функции
def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user(db, username: str):
    return db.query(User).filter(User.username == username).first()


def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


@app.post("/devices", tags=["Devices"])
async def add_device(account_id: int, name: str, request: Request):
    client_host = request.client.host
    db_request = Device(
        name=name,
        account_id=account_id,
        ip=client_host
    )
    session.add(db_request)
    session.commit()
    return {"message": "device saved"}


@app.put("/devices/{id}", tags=["Devices"])
async def update_device_address(id: int, request: Request):
    device_to_update = session.query(Device).filter_by(id=id).first()
    if device_to_update:
        device_to_update.ip = request.client.host
        session.commit()
        return {"message": "address updated"}
    else:
        return {"message": "device not found"}


@app.get("/devices", tags=["Devices"])
async def get_device_list(account_id: int):
    devices = session.query(Device).filter_by(account_id=account_id).all()
    if devices:
        device_list = [{"id":int(device_id.__dict__["id"]), "name":device_id.__dict__["name"]} for device_id in devices]
        return device_list
    else:
        return {"message": "account not found"}


@app.get("/devices/{id}", tags=["Devices"])
async def get_device_address(id: int):
    device = session.query(Device).filter_by(id=id).first()
    ip_address = device.__dict__["ip"]

    return ip_address


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/register", tags=["Users"])
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {f"message": f"user {user.username} successfully created"}


@app.post("/token", tags=["Users"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return access_token

@app.get("/users/me", tags=["Users"])
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.put("/users/me", tags=["Users"])
async def update_user_me(user: UserEdit, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    current_user.email = user.email
    current_user.full_name = user.full_name
    db.commit()
    db.refresh(current_user)
    return current_user


@app.post("/users/{id}/upload", tags=["Sync"])
async def upload_photo(file: UploadFile, id: int):
    bucket_name = f"user{id}"
    found = minio_client.bucket_exists(bucket_name)
    if not found:
        minio_client.make_bucket(bucket_name)
    file_data = await file.read()
    file_name = file.filename
    file_data_stream = io.BytesIO(file_data)
    minio_client.put_object(
            bucket_name,
            file_name,
            data=file_data_stream,
            length=len(file_data),
            content_type=file.content_type
    )
    return JSONResponse(content={"filename": file_name}, status_code=200)


@app.get("/users/{id}/download", tags=["Sync"])
async def download_file(id: int, filename: str):
    bucket_name = f"user{id}"

    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Bucket not found")

    response = minio_client.get_object(bucket_name, filename)
    metadata = minio_client.stat_object(bucket_name, filename)
    return StreamingResponse(response, media_type=metadata.content_type,
                             headers={"Content-Disposition": f"attachment; filename={filename}"})


@app.delete("/users/{id}/delete", tags=["Sync"])
async def delete_file(id: int, filename: str):
    bucket_name = f"user{id}"
    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Bucket not found")

    minio_client.remove_object(bucket_name, filename)
    
    return {"detail": f"File '{filename}' deleted successfully."}


@app.get("/users/{id}/list", tags=["Sync"])
async def list_files(id: int):
    bucket_name = f"user{id}"

    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Bucket not found")

    objects = minio_client.list_objects(bucket_name)

    file_list = [obj.object_name for obj in objects]
    return file_list


@app.get("/users/{id}/syncsize", tags=["Sync"])
async def list_files(id: int):
    bucket_name = f"user{id}"

    if not minio_client.bucket_exists(bucket_name):
        raise HTTPException(status_code=404, detail="Bucket not found")

    objects = minio_client.list_objects(bucket_name)
    size = 0
    for obj in objects:
        size += int(obj.size)
    size_mb = (size/1024)/1024
    return round(size_mb, 3)
