from sqlalchemy import (
    Column,
    Integer,
    String
)

from .meta import Base

class Color(Base):
    __tablename__ = 'color'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)