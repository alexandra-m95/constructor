from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean
)

from .meta import Base

class Object(Base):
    __tablename__ = 'object'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)