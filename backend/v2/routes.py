from fastapi import APIRouter, File, UploadFile
import numpy as np
from pydantic import BaseModel # datca validation and settings management
import cv2
from io import BytesIO

print(cv2.__version__)

router = APIRouter()

class NumberList(BaseModel):
    values: list[float]

@router.get("/users")
def get_users_v2():
    return {"version": "v2", "users": ["Alice", "Bob", "Charlie"]}


# POST /sum
# {
#   "values": [10, 20, 30, 40, 50] #   "sum": 150
# }
@router.post("/sum")
def sum_numbers(data: NumberList):
    total = np.sum(data.values)
    return {"sum": float(total)}

# POST /stats
# {
#   "values": [10, 20, 30, 40, 50]
# }
@router.post("/stats")
def calculate_stats(data: NumberList):
    arr = np.array(data.values)
    mean = np.mean(arr)
    std = np.std(arr)
    return {
        "mean": mean,
        "std_dev": std
    }

# Metrics
class Matrices(BaseModel):
    A: list[list[float]]
    B: list[list[float]]

# {
#   "A": [[1, 2], [3, 4]],
#   "B": [[5, 6], [7, 8]]
# }
@router.post("/matrix/multiply")
def multiply_matrices(data: Matrices):
    A = np.array(data.A)
    B = np.array(data.B)
    result = np.dot(A, B)
    return {"result": result.tolist()}


# Image processing : Image Processing with NumPy + OpenCV
# Upload an image and get the average grayscale pixel value — useful for quick diagnostics or preprocessing.
@router.post("/image/gray")
async def convert_to_grayscale(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mean_pixel = float(np.mean(gray))
    return {"mean_gray_pixel_value": mean_pixel}