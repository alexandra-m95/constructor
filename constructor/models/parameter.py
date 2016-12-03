from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean
)

from .meta import Base

class Parameter(Base):
    __tablename__ = 'parameter'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    is_disabled = Column(Boolean, nullable=False)