from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from .meta import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    login = Column(String, nullable=False)
    password = Column(String, nullable=False)