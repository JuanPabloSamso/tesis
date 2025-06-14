import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../services/api';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { APP_COLORS } from '../../constants';

const LIMIT = 20;

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (reset = false) => {
    if (!categoryId) return;
    if (!reset && !hasMore) return;
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
        setHasMore(true);
      } else {
        setIsFetchingMore(true);
      }
      const data = await getProducts({ category: categoryId, limit: LIMIT, offset: reset ? 0 : offset });
      if (reset) {
        setProducts(data);
        setOffset(LIMIT);
        setHasMore(data.length === LIMIT);
      } else {
        setProducts(prev => [...prev, ...data]);
        setOffset(prev => prev + LIMIT);
        setHasMore(data.length === LIMIT);
      }
    } catch (error) {
      console.error("Failed to fetch category products:", error);
      setError("No se pudieron cargar los productos para esta categoría. Por favor, intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [categoryId, offset, hasMore]);

  useEffect(() => {
    fetchProducts(true);
    // eslint-disable-next-line
  }, [categoryId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !loading && !isFetchingMore && hasMore
      ) {
        fetchProducts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, isFetchingMore, hasMore, fetchProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold ${APP_COLORS.neutral800} mb-8`}>
        {categoryId || 'Categoría'}
      </h1>
      {error ? (
        <p className={`${APP_COLORS.actionRed}`}>{error}</p>
      ) : products.length === 0 ? (
        <p className={`${APP_COLORS.neutral700}`}>No se encontraron productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.ean} product={product} />
          ))}
        </div>
      )}
      {(loading || isFetchingMore) && (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      )}
      {!hasMore && products.length > 0 && (
        <div className="text-center text-gray-400 py-4">No hay más productos para mostrar.</div>
      )}
    </div>
  );
};

export default CategoryPage;