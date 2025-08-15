from fastapi import FastAPI, Depends, HTTPException, Form, File, UploadFile
from connectdbsqlite.models import User

DATABASE_URL = "sqlite:///./test.db"
def hello_world():    
    return {"message": "Hello, World!"}
    

def get_user_by_id(user_id: int, db):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
#     db_item = models.Item(title = item.title, description = item.description, owner_id=user_id)
    
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item
