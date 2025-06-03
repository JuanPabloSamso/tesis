import { Routes, Route } from 'react-router-dom';
import { useState, useMemo } from 'react';

import Header         from './components/Header';
import CategoryNav    from './components/CategoryNav';

import Home           from './pages/Home';
import SearchResults  from './pages/SearchResults';
import CategoryResults from './pages/CategoryResults';   // ← NUEVO
import Cart           from './components/Cart';

export default function App() {
  const [cart, setCart] = useState([]);

  /* ──────── helpers carrito ──────── */
  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.ean === product.ean);
      return found
        ? prev.map((p) =>
            p.ean === product.ean ? { ...p, qty: p.qty + 1 } : p
          )
        : [...prev, { ...product, qty: 1 }];
    });
  };

  /* cantidad total de ítems (no sólo referencias) */
  const cartQty = useMemo(
    () => cart.reduce((sum, p) => sum + p.qty, 0),
    [cart]
  );

  /* ───────────── rutas ───────────── */
  return (
    <>
      <Header cartQty={cartQty} />
      <CategoryNav />

      <Routes>
        <Route path="/"                element={<Home addToCart={addToCart} />} />
        <Route path="/search/:q"       element={<SearchResults   addToCart={addToCart} />} />
        <Route path="/category/:category" element={<CategoryResults addToCart={addToCart} />} />
        <Route path="/cart"            element={<Cart cart={cart} />} />
        {/* fallback */}
        <Route path="*" element={<Home addToCart={addToCart} />} />
      </Routes>
    </>
  );
}
