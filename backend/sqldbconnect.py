from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
# import pyodbc

# print(pyodbc.version)

# DATABASE_URL = "sqlite:///./test.db"
# DATABASE_URL = "mssql+pymssql://sa:Swindon@123@localhost:1433/mydapdb"
# DATABASE_URL = "mssql+pyodbc://sa:Swindon%40123@localhost/mydapdb?driver=ODBC+Driver+17+for+SQL+Server"
DATABASE_URL = "mssql+pyodbc://localhost/mydapdb?trusted_connection=yes&driver=ODBC+Driver+17+for+SQL+Server"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

app = FastAPI()



Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/users/")
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@app.get("/")  # Decorator for GET requests to the root URL
async def read_root():
    """Root endpoint that returns a simple message. """
    return {"message": "Hello, World!"}