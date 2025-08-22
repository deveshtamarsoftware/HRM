## Start backend

Windows
 - Go to python.org/downloads
 - Download the latest Python 3.x installer.
 - Run it and check the box ✅ "Add Python to PATH".
 
Download Python
 - The official home of the Python Programming Language
 
### Setup Python
```
python --version
 
create .env 
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=admin@123
MYSQL_DB=myapp
 
 
$ python -m venv .venv
$ .venv\Scripts\activate
$ pip install -r requirements.txt
 
pip freeze > requirements.txt   - to add file if not exist
uvicorn main:app --reload
pip install mysql
ctrl + c to come out
pip list
 
pip install mysql-connector-python
http://127.0.0.1:8000/docs
```