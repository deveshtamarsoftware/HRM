from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv
load_dotenv()  # Loads .env into environment

# DATABASE_URL = "sqlite:///./test.db"
DATABASE_URL = os.getenv("DB_URL_MSSQL")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}) ##use same thread for sqlite
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False) ## autoflush-flush changes to the db before exec query
Base = declarative_base() # help to create a base class, help to manage the db with models


