from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from .meta import Base
from sqlalchemy.orm import relationship

class Texture(Base):
    __tablename__ = 'texture'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    color_id = Column(Integer, ForeignKey('color.id'))
    link = Column(String, nullable=False)

    color = relationship("Color", backref="textures")