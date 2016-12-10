from sqlalchemy import (
    Column,
    Integer,
    String
)

from .meta import Base
import bcrypt

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    login = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)

    def __init__(self, login, password):
        self.login = login
        self.password_hash = bcrypt.hashpw(password, bcrypt.gensalt())

    def validate_password(self, password):
        return bcrypt.checkpw(str.encode(password), self.password_hash)


