// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
});

/* ──────────── Productos ──────────── */

/** Catálogo completo o filtrado. 
 *  params puede incluir:
 *    { q, category, subcategory, supermarket, limit, offset } */
export const getProducts = (params = {}) =>
  api.get('/products', { params }).then(r => r.data);

/** Búsqueda con texto y filtros extra. */
export const searchProducts = (text, extraFilters = {}) => {
  const params = text ? { q: text, ...extraFilters } : { ...extraFilters };
  if (!Object.keys(params).length) return Promise.resolve([]);
  return api
    .get('/products', { params })
    .then(r => r.data)
    .catch(() => []);
};

/* ───────────── Carrito ───────────── */

export const quoteCart = (items) =>
  api.post('/cart/quote', items).then(r => r.data);

/* ─────────── Categorías (caché en memoria) ─────────── */

let cachedCategories = null;

/** Devuelve la lista única de categorías; hace 1 request y luego cachea. */
export const getCategories = async () => {
  if (cachedCategories) return cachedCategories;

  /* Idealmente el backend expondría /categories.
     Mientras tanto—hacemos 1 sola llamada con limit=1e6 y memorizamos. */
  const products = await getProducts({ limit: 10000 });
  cachedCategories = [
    ...new Set(products.map((p) => p?.category_rel?.category).filter(Boolean))
  ].sort();
  return cachedCategories;
};

export default api;
