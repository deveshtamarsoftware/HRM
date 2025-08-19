import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()  # Loads env variables from .env

def connect():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB")
    )
