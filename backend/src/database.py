from typing import AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from src.config import settings
from src.db_base import Base


engine = create_async_engine(
    settings.db.url,
    echo=settings.db.echo,
    future=settings.db.future,
    pool_size=10,
    max_overflow=5,
    pool_timeout=30,
    pool_recycle=1800,
)

sync_engine = create_engine(
    settings.db.url.replace("+asyncpg", ""),
    echo=settings.db.echo,
    future=settings.db.future,
    pool_pre_ping=True
)


AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

SyncSessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=sync_engine
)


from src.models import *

async def init_db():
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

def get_sync_session():
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()
