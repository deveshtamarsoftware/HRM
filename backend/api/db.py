# db.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# Example: "mysql+aiomysql://user:password@localhost:3306/myapp?charset=utf8mb4"
DATABASE_URL = "mysql+aiomysql://root:password@localhost:3306/myapp?charset=utf8mb4"

engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False,  # toggle to True for SQL logging
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
