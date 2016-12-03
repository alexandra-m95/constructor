from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
)

from .meta import Base

class ActiveIcon(Base):
    __tablename__ = 'active_icon'

    id = Column(Integer, primary_key=True, autoincrement=True)
    link = Column(String, nullable=False)