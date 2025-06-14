import axios from 'axios';
import { ProductPrice } from '../../types';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});

export interface Product {
  ean: string;
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  brand?: string;
  category_rel?: {
    category: string;
    subcategory: string;
  };
  prices?: ProductPrice[];
}

export interface CartItem {
  ean: string;
  quantity: number;
}

export const getProducts = async (params = {}) => {
  // Limpiar params: eliminar claves con undefined, null o string vacío
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ''
    )
  );
  const response = await api.get('/products', { params: cleanParams });
  console.log('API /products response:', response.data); // DEBUG
  return response.data.map((product: any) => ({
    ean: product.ean,
    name: product.name,
    description: product.description || '',
    image_url: product.image_url || 'https://picsum.photos/400/300?grayscale',
    category_id: product.category_id ? product.category_id.toString() : '',
    brand: product.brand || '',
    category_rel: product.category_rel ? {
      category: product.category_rel.category || '',
      subcategory: product.category_rel.subcategory || ''
    } : { category: '', subcategory: '' },
    prices: product.prices || [],
  }));
};

export const searchProducts = async (text: string, extraFilters = {}) => {
  const params = text ? { q: text, ...extraFilters } : { ...extraFilters };
  if (!Object.keys(params).length) return [];
  return getProducts(params);
};

export const getProductByEan = async (ean: string) => {
  const response = await api.get(`/products/${ean}`);
  const product = response.data;
  return {
    ...product,
    category_id: product.category_id ? product.category_id.toString() : '',
    description: product.description || '',
    image_url: product.image_url || 'https://picsum.photos/400/300?grayscale',
    prices: (product.prices || []).map((p: any) => ({
      ean: product.ean,
      supermarket_id: Number(p.supermarket_id),
      price: Number(p.price),
      supermarket: p.supermarket_name || p.supermarket || 'Desconocido',
    })),
    category_rel: product.category_rel ? {
      category: product.category_rel.category || '',
      subcategory: product.category_rel.subcategory || ''
    } : { category: '', subcategory: '' },
  };
};

export const getSupermarkets = async () => {
  const response = await api.get('/supermarkets');
  // Si la respuesta es un array de strings, mapea a objetos
  let supermarkets = response.data;
  if (Array.isArray(supermarkets) && typeof supermarkets[0] === 'string') {
    supermarkets = supermarkets.map((name, idx) => ({
      supermarket_id: idx + 1,
      name
    }));
  }
  // Filtra supermercados únicos por supermarket_id
  const unique = Array.from(
    new Map(supermarkets.map(sm => [sm.supermarket_id, sm])).values()
  );
  return unique;
};

export const quoteCart = async (items: CartItem[]) => {
  const response = await api.post('/cart/quote', items);
  return response.data;
};

export const getCheapestPriceForProduct = (prices: Array<{ price: number }>) => {
  if (!prices || prices.length === 0) return null;
  return Math.min(...prices.map(p => p.price));
};

export const getCategories = async () => {
  const products = await getProducts({ limit: 100 });
  const categories = [
    ...new Set(products.map((p) => p?.category_rel?.category).filter(Boolean))
  ].sort();
  console.log('CATEGORIES:', categories); // DEBUG
  return categories;
};

export default api; 