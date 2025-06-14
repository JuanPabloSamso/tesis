# app/main.py
from __future__ import annotations

import os
from datetime import datetime
from decimal import Decimal
from typing import Dict, List, Optional, Set

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import distinct

from .database import Base, engine, get_db
from .models import (
    Product,
    Category,
    Supermarket,
    ProductPrice,
)
from .schemas import (
    ProductOut,
    CartItemIn,
    CartQuoteOut,
    CartQuotePerMarket,
)

from collections import defaultdict


# ───────────────────────────── FastAPI app ─────────────────────────────
app = FastAPI(
    title="Supermarket Comparison API",
    description=(
        "Devuelve precios por supermercado y cotiza el total del carrito "
        "indicando disponibilidad."
    ),
    version="1.1.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────── crear tablas al arrancar ──────────────────────
@app.on_event("startup")
def _startup_create_tables() -> None:
    Base.metadata.create_all(engine)

# ────────────────────────── Endpoints públicos ─────────────────────────

@app.get("/supermarkets", response_model=List[dict])
def list_supermarkets(db: Session = Depends(get_db)):
    """Lista todos los supermercados registrados."""
    return [
        {"supermarket_id": id, "name": name}
        for (id, name) in db.query(Supermarket.id, Supermarket.name).order_by(Supermarket.name)
    ]


@app.get("/products", response_model=List[ProductOut])
def list_products(
    q: Optional[str] = None,
    category_id: Optional[int] = None,
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    supermarket: Optional[str] = None,
    limit: int = Query(40, le=100),
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Listado de productos con filtros opcionales.

    • q : búsqueda por texto en el nombre  
    • category_id : filtra por ID de categoría  
    • category / subcategory : filtra por texto (case-insensitive)  
    • supermarket : devuelve sólo productos que tengan precio en ese súper  
    • limit / offset : paginación (máx 100 por request)
    """
    # base query + joins necesarios para filtros
    stmt = (
        db.query(Product)
        .join(Product.category_rel)
        .options(
            joinedload(Product.category_rel),
            joinedload(Product.prices).joinedload(ProductPrice.supermarket),
        )
    )

    if q:
        stmt = stmt.filter(Product.name.ilike(f"%{q}%"))

    if category_id:
        stmt = stmt.filter(Product.category_id == category_id)

    if category:
        stmt = stmt.filter(Category.category.ilike(category))

    if subcategory:
        stmt = stmt.filter(Category.subcategory.ilike(subcategory))

    if supermarket:
        stmt = (
            stmt.join(Product.prices)
            .join(ProductPrice.supermarket)
            .filter(Supermarket.name.ilike(supermarket))
        )

    products = (
        stmt.distinct(Product.ean)
        .offset(offset)
        .limit(limit)
        .all()
    )
    return products


@app.get("/products/{ean}", response_model=ProductOut)
def product_detail(ean: str, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(
            joinedload(Product.category_rel),
            joinedload(Product.prices).joinedload(ProductPrice.supermarket),
        )
        .filter(Product.ean == ean)
        .first()
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/cart/quote", response_model=CartQuoteOut)
def quote_cart(items: List[CartItemIn], db: Session = Depends(get_db)):
    if not items:
        raise HTTPException(status_code=400, detail="Empty cart")

    # EAN → cantidad
    qty_map: Dict[str, int] = {i.ean: i.quantity for i in items}

    # 1. Traemos todas las combinaciones (ean, supermercado) existentes
    rows: List[ProductPrice] = (
        db.query(ProductPrice)
        .options(joinedload(ProductPrice.supermarket))
        .filter(ProductPrice.ean.in_(qty_map.keys()))
        .all()
    )

    # 2. Acumulamos totales y eans presentes por supermercado
    per_market: Dict[int, Dict] = defaultdict(
        lambda: {"name": "", "total": Decimal("0.00"), "present": set()}
    )

    for row in rows:
        m = per_market[row.supermarket_id]
        m["name"] = row.supermarket.name
        m["present"].add(row.ean)
        m["total"] += row.price * qty_map[row.ean]

    # 3. Calculamos faltantes por supermercado
    mercados: List[CartQuotePerMarket] = []
    all_eans: Set[str] = set(qty_map)

    for sm_id, data in per_market.items():
        faltantes = sorted(all_eans - data["present"])
        mercados.append(
            CartQuotePerMarket(
                supermarket=data["name"],
                total=data["total"],
                all_available=len(faltantes) == 0,
                unavailable_products=faltantes,
            )
        )

    # 4. Ordenamos por total ascendente
    mercados.sort(key=lambda m: m.total)

    return CartQuoteOut(quote_date=datetime.utcnow(), markets=mercados)


# ───────────────────────────── ejecución local ─────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", reload=True)
