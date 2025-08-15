# https://www.youtube.com/watch?v=VFu95RjLSQ8
# https://github.com/vipankumar123/Educational-Purpose

from fastapi import APIRouter, Path, Query, Form,File, UploadFile
from fastapi.exceptions import HTTPException
from typing import Union #var to handle optional types, Union[int,str]
from pydantic import BaseModel # datca validation and settings management
from enum import Enum

class Item(BaseModel):
    """Representation of an item in the system."""
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None


class Category(Enum):
    """Enumeration for item categories."""  
    TOOLS = "tools"
    CONSUMABLES = "consumables" 

class User(BaseModel):
    """Representation of a user in the system."""   
    name: str
    email: str
    age: int
    category: Category  
    id: int
    count: int

users_items = {
    0: Item(name="Hammer", price=9.99, count=20, id=0, category=Category.TOOLS),
    1: Item(name="Pliers", price=5.99, count=20, id=1, category=Category.TOOLS),
    2: Item(name="Nails", price=1.99, count=100, id=2, category=Category.CONSUMABLES),
}

router = APIRouter()

@router.get("/")
async def read_root():
    """Root endpoint that returns a simple message."""
    return {"message": "Hello, World!"}

#Path Parameters URL (/item/5).
@router.get("/item/{item_id}")
async def path_func(item_id: int):
  var_name = {'path variable': item_id}
  return var_name

# Path Parameters,item_id is a path parameter & must be included in the URL (/items/5).
@router.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}

# Query Parameters, Used when values are optional and passed after ? in the URL.
@router.get("/items-parameter/")
async def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}
# Here, skip and limit are query parameters (/items/?skip=5&limit=20).

# Using Path and Query for Validation
@router.get("/items-validations/{item_id}")
async def read_item(
    item_id: int = Path(..., title="Item ID", ge=1),
    q: str = Query(None, min_length=3, max_length=50)
):
    return {"item_id": item_id, "q": q}
# Path(..., ge=1): Ensures item_id is greater than or equal to 1.
# Query(None, min_length=3, max_length=50): Ensures q is between 3 and 50 characters.


@router.get("/query/")
async def query_func(name:str = None, age:int = None):
  var_name = {'query variable': name, 'age': age}
  return var_name

@router.get("/query/validation")
async def query_func(name:str = None, roll_no:Union[int, None]=None, age:int = None, address:str = Query(None, min_length=5, max_length=50)):
  var_name = {'query variable': name, 'roll_no': roll_no, 'age': age, 'address': address}
  return var_name

@router.get("/item-validation/{item_id}")
async def get_item(item_id: int = Path(..., title="The ID of the item to get", ge=5, le=50)):
    """Endpoint to get an item by its ID."""
    # if item_id not in users_items:
    #     raise HTTPException(status_code=404, detail="Item not found")
    if (users_items[item_id].count <= 5):
        raise HTTPException(status_code=404, detail="Item out of stock")
    if item_id >= len(users_items):
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    if item_id < 0:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    if users_items[item_id] is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return users_items[item_id]


@router.post("/item/test-post")
async def post_func(item: Item):
    """Endpoint to create a new item."""
    return {"item": item}


# Form Data, using query and form data
@router.post("/form/data")
# async def form_data(name: str, age: int): //show query parameters
async def form_data(name: str=Form(), age: int=Form()): #show string and integer form data
    """Endpoint to receive form data."""
    return {"name": name, "age": age}

class ItemTCB(BaseModel):
    """Representation of an item in the system."""
    name: str
    description: Union[str, None] = None
    price: float
    tax: Union[float, None] = None

# using JSON
@router.post("/form-json/data")
async def form_data(items:ItemTCB): # using JSON body
    """Endpoint to receive form data."""
    return {"name": items.name, "description": items.description, "price": items.price, "tax": items.tax} 

# upload file
# from fastapi import File, UploadFile

# @router.post("/uploadfile/")
# async def upload_file(file: UploadFile = File(...)):
#     """Endpoint to upload a file."""
#     return {"filename": file.filename}  

@router.post("/uploadfile/")
async def file_bytes_len(file: bytes = File(...)):
    return {"file_size": len(file)}

@router.post("/uploadfile/file")
async def file_upload(file:UploadFile):
    return ({"filename": file.filename, "content_type": file.content_type, "file_size": len(file.file.read())})


## error handling, 2 items return, >2 items return error
@router.get("/error/{item_id}")
async def error_func(item_id: int):
    if item_id not in users_items:
        raise HTTPException(status_code=404, detail="Item not found")
    return users_items[item_id]

items = [1,2,3,4,5,6,7,8,9,10]  # Example list of items
@router.get("/error-array/{item_id}")
async def error_func_array(item: int):
    if item not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"value": item}