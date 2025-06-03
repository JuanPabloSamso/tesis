from datetime import datetime
from decimal import Decimal
from typing import List
from pydantic import BaseModel, Field


class CategoryOut(BaseModel):
    id: int
    category: str
    subcategory: str

    class Config:
        orm_mode = True


class ProductPriceOut(BaseModel):
    price: Decimal
    supermarket: str = Field(alias="supermarket_name")

    class Config:
        orm_mode = True
        allow_population_by_field_name = True  


class ProductOut(BaseModel):
    ean: str
    name: str
    category_rel: CategoryOut
    prices: List[ProductPriceOut]

    class Config:
        orm_mode = True


class CartItemIn(BaseModel):
    ean: str
    quantity: int


class CartQuotePerMarket(BaseModel):
    supermarket: str
    total: Decimal
    all_available: bool
    unavailable_products: List[str]


class CartQuoteOut(BaseModel):
    quote_date: datetime
    markets: List[CartQuotePerMarket]
