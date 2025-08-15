from fastapi import FastAPI, HTTPException, Depends,Form
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
import jwt

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# JWT Authentication  
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Dummy user data
fake_user = {
    "username": "testuser",
    "password": "secure123"
}

# Function to create JWT token
def create_jwt_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)):
    to_encode = data.copy() # Create a copy of the data dictionary  
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/token")
def login(username: str = Form(...), password: str = Form(...)):
    if username != fake_user["username"] or password != fake_user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_jwt_token({"sub": username})
    return {"access_token": token, "token_type": "bearer"}

# Protected route
@app.get("/protected")
def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"message": f"Hello {payload['sub']}, you're authenticated!"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")