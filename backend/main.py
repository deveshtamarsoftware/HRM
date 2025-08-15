from fastapi import FastAPI, HTTPException, Depends, Request, Form, status
from typing import Optional
from pydantic import BaseModel,Field
from enum import Enum
from v1 import routes as v1_routes
from v2 import routes as v2_routes
from basic import basic_status_code, basic

# Create an instance of the FastAPI class
app = FastAPI()

app.include_router(v1_routes.router, prefix="/v1", tags=["v1"])
app.include_router(v2_routes.router, prefix="/v2", tags=["v2"])
app.include_router(basic_status_code.router, prefix="/books", tags=["books-status-code"])
app.include_router(basic.router, prefix="/books-status", tags=["books-basic"])
app.include_router(basic.router, prefix="/books-status", tags=["books-basic"])

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

# Docstrings of classes will be reflected in the API documentation in the 'Schemas' section
class Category(Enum):
    TOOLS = "tools"
    CONSUMABLES = "consumables"
class User(BaseModel):
    name: str
    price: float
    count: int
    id: int
    category: Category

users_items = {
    0: Item(name="Hammer", price=9.99, count=20, id=0, category=Category.TOOLS),
    1: Item(name="Pliers", price=5.99, count=20, id=1, category=Category.TOOLS),
    2: Item(name="Nails", price=1.99, count=100, id=2, category=Category.CONSUMABLES),
}

# You can add metadata to attributes using the Field class.
# This information will also be shown in the auto-generated documentation.
class Item_Customer(BaseModel):
    """Representation of an item in the system."""
    name: str = Field(description="Name of the item.")
    price: float = Field(description="Price of the item in Euro.")
    count: int = Field(description="Amount of instances of this item in stock.")
    id: int = Field(description="Unique integer that specifies this item.")
    category: Category = Field(description="Category this item belongs to.")

item_customer = {
    0: Item_Customer(name="Hammer", price=9.99, count=20, id=0, category=Category.TOOLS),
    1: Item_Customer(name="Pliers", price=5.99, count=20, id=1, category=Category.TOOLS),
    2: Item_Customer(name="Nails", price=1.99, count=100, id=2, category=Category.CONSUMABLES),
}


items = []
# Define a route using a decorator and async function
@app.get("/")  # Decorator for GET requests to the root URL
async def read_root():
    """Root endpoint that returns a simple message. """
    return {"message": "Hello, World!"}

@app.get("/users/items")  # Endpoint to get items for all users
# async def get_users_items():
#     return users_items
def index() -> dict[str, dict[int, Item]]:
    return {"items": users_items}

# $ curl -X GET 'http://127.0.0.1:8000/items?limit=2'
@app.get("/items")
def list_items(limit: int = 10):
    # return items
    return items[0:limit]

# curl -X GET http://127.0.0.1:8000/items/customer
@app.get("/items/customer")  # Endpoint to get items for customers
# async def get_items_customer():
#     return item_customer
def get_items_customer() -> dict[str, dict[int, Item_Customer]]:
    """Return a dictionary containing items for customers."""
    return {"items": item_customer}

# curl -X GET http://127.0.0.1:8000/items/2 
# Get an Item by ID : items/2 
@app.get("/items/{item_id}")  # Decorator for GET requests with path parameter
async def get_item(item_id: int):  # Path parameter with type integer
    # if item_id not in range(len(items)):
    #     raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    # if item_id not in items:
    #     raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    # item = items[item_id] 
    # return {"item_id": item_id}
    if item_id >= len(items):
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    item = items[item_id]
    return item #return {"item_id": item_id}

@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}

@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}


# curl -X POST -H "Content-Type: application/json" "http://127.0.0.1:8000/items?item=apple"
@app.post("/items")
def create_item(item: str):
    print("Received item:", item)
    items.append(item)
    return items


@app.post("/itemsMx/")
async def create_itemMx(item: Item):
  item_dict = item.dict() #dictionary 
  if item.tax:
    price_with_tax  = item.price + item.tax
    item_dict.update({"price_with_tax":price_with_tax})
  return item_dict

#declare path parameters and a request body at the same time
@app.put("/items/{item_id}")
async def create_item(item_id: int, item: Item):
    return {"item_id": item_id, **item.dict()}

# Function parameters that are not path parameters can be specified as query parameters in the URL
# Here we can query items like this /items?count=20
Selection = dict[
    str, str | int | float | Category | None
]  # dictionary containing the user's query arguments

# This function allows users to query items by various parameters such as name, price, count, and category and returns a selection of items that match the criteria with dictionary containing the query parameters and the selection of items.
# If no parameters are provided, it returns all items.  

@app.get("/items_list/")
def query_item_by_parameters(
    name: str | None = None,
    price: float | None = None,
    count: int | None = None,
    category: Category | None = None,
) -> dict[str, list[User]]:
    # Create a function to check if an item matches the query parameters
    def check_item(item: User):
        """Check if the item matches the query arguments from the outer scope."""
        return all(
            (
                name is None or item.name == name,
                price is None or item.price == price,
                count is None or item.count != count,
                category is None or item.category is category,
            )
        )

    selection = [item for item in users_items.values() if check_item(item)]
    return {
        "query": {"name": name, "price": price, "count": count, "category": category},
        "selection": selection,
    }

# Add an item to the list of items
# curl -X POST -H "Content-Type: application/json" -d '{"id": 3, "name": "Screwdriver", "price": 3.99, "count": 50, "category": "tools"}' http://127.0.0.1:8000/items
# This function adds an item to the list of items and returns the added item.
# If the item already exists, it raises an HTTPException with a 400 status code.
@app.post("/")
def add_item(item: Item) -> dict[str, Item]:
    if item.id in items:
        HTTPException(status_code=400, detail=f"Item with {item.id=} already exists.")

    items[item.id] = item
    return {"added": item}

# Update an item by ID
# curl -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Item", "price": 12.99, "count": 5}' http://127.0.0.1:8000/update/1
@app.put("/update/{item_id}")
def update(
    item_id: int,
    name: str | None = None,
    price: float | None = None,
    count: int | None = None,
):
    if item_id not in items:
        HTTPException(status_code=404, detail=f"Item with {item_id=} does not exist.")
    if all(info is None for info in (name, price, count)):
        raise HTTPException(
            status_code=400, detail="No parameters provided for update."
        )

    item = items[item_id]
    if name is not None:
        item.name = name
    if price is not None:
        item.price = price
    if count is not None:
        item.count = count

    return {"updated": item}

# Delete an item by ID
# curl -X DELETE http://127.0.0.1:8000/delete/1
@app.delete("/delete/{item_id}")
def delete_item(item_id: int) -> dict[str, Item]:
    if item_id not in items:
        raise HTTPException(
            status_code=404, detail=f"Item with {item_id=} does not exist."
        )

    item = items.pop(item_id)
    return {"deleted": item}

@app.get("/items-status-code/", status_code=status.HTTP_200_OK)
def read_items():
    return [{"name": "Plumbus"}, {"name": "Portal Gun"}]


# main.py
# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# from connet_db.db import Base, engine, SessionLocal, User
# from pydantic import BaseModel
# # from fastapi_pagination import Page, add_pagination, paginate
# # from fastapi_pagination.ext.sqlalchemy import paginate as sqlalchemy_paginate

# Base.metadata.drop_all(bind=engine)
# Base.metadata.create_all(bind=engine)
# app = FastAPI()
# # add_pagination(app)

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# class UserCreate(BaseModel):
#     name: str
#     age: int

# class UserOut(BaseModel):
#     id: int
#     name: str
#     age: int
#     class Config:
#         orm_mode = True

# @app.post("/users/", response_model=UserOut)
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     db_user = User(**user.dict())
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# @app.get("/users/")
# def read_users(db: Session = Depends(get_db)):
#     return db.query(User).all()

# @app.put("/users/{user_id}", response_model=UserOut)
# def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")
#     db_user.name = user.name
#     db_user.age = user.age
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# @app.delete("/users/{user_id}")
# def delete_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")
#     db.delete(db_user)
#     db.commit()
#     return {"ok": True}