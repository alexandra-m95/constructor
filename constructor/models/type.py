from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
    Table
)

from .meta import Base
from sqlalchemy.orm import relationship


types_colors_association = Table('type_color', Base.metadata,
                     Column('type_id', Integer, ForeignKey('type.id')),
                     Column('color_id', Integer, ForeignKey('color.id'))
                     )

types_textures_association = Table('type_texture', Base.metadata,
                                 Column('type_id', Integer, ForeignKey('type.id')),
                                 Column('texture_id', Integer, ForeignKey('texture.id'))
                                 )

types_objects_association = Table('type_object', Base.metadata,
                                 Column('type_id', Integer, ForeignKey('type.id')),
                                 Column('object_id', Integer, ForeignKey('object.id'))
                                 )

class Type(Base):
    __tablename__ = 'type'

    id = Column(Integer, primary_key=True, autoincrement=True)
    parameter_id = Column(Integer, ForeignKey('parameter.id'))
    name = Column(String, nullable=False)
    text_is_invisibly = Column(Boolean, nullable=False)
    price = Column(Integer, nullable=False)
    coloring_type = Column(Integer, nullable=False)
    icon_id = Column(Integer, ForeignKey('icon.id'))
    active_icon_id = Column(Integer, ForeignKey('active_icon.id'))

    icon = relationship("Icon", uselist=False, backref="type")
    active_icon = relationship("ActiveIcon", uselist=False, backref="type")
    colors = relationship("Color", secondary=types_colors_association)
    textures = relationship("Texture", secondary=types_textures_association)
    objects = relationship("Object", secondary=types_objects_association)

    parameter = relationship("Parameter", backref="types")