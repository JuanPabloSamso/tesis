# app/models.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    ForeignKey,
    UniqueConstraint,
    PrimaryKeyConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base

# ───────────────────────── Supermarket ──────────────────────────
class Supermarket(Base):
    __tablename__ = "Supermarket"

    id   = Column("supermarket_id", Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)

    prices = relationship("ProductPrice", back_populates="supermarket")

# ────────────────────────── Category ────────────────────────────
class Category(Base):
    __tablename__ = "Category"
    __table_args__ = (
        UniqueConstraint("category", "subcategory", name="uq_cat_sub"),
    )

    id          = Column("category_id", Integer, primary_key=True, autoincrement=True)
    category    = Column(String(100), nullable=False)
    subcategory = Column(String(100), nullable=False)

    products = relationship("Product", back_populates="category_rel")

# ─────────────────────────── Product ────────────────────────────
class Product(Base):
    __tablename__ = "Product"

    ean         = Column(String(20), primary_key=True)  # clave natural
    name        = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("Category.category_id"), nullable=False)

    category_rel = relationship("Category", back_populates="products")
    prices       = relationship("ProductPrice", back_populates="product")

# ──────────────────────── ProductPrice ──────────────────────────
class ProductPrice(Base):
    __tablename__ = "ProductPrice"
    __table_args__ = (
        PrimaryKeyConstraint("ean", "supermarket_id", name="pk_product_price"),
        UniqueConstraint("ean", "supermarket_id", name="uq_product_market"),
    )

    ean            = Column(String(20),  ForeignKey("Product.ean"), nullable=False)
    supermarket_id = Column(Integer,     ForeignKey("Supermarket.supermarket_id"), nullable=False)
    price          = Column(Numeric(10, 2), nullable=False)
    # La tabla real no lleva columna 'in_stock'.  Si la añades algún día:
    # in_stock = Column(Boolean, default=True)

    product     = relationship("Product",     back_populates="prices")
    supermarket = relationship("Supermarket", back_populates="prices")
    @property
    def supermarket_name(self) -> str:
        """Nombre plano del supermercado; útil para Pydantic."""
        return self.supermarket.name