import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts, Product } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { APP_COLORS } from '../../constants';

const SearchResultsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await searchProducts(query);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setError("No se pudieron cargar los resultados de la búsqueda. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-2xl font-semibold ${APP_COLORS.neutral800} mb-6`}>
        Resultados para: "<span className={`${APP_COLORS.primaryBlue}`}>{query}</span>"
      </h1>
      {error ? (
        <p className={`${APP_COLORS.actionRed}`}>{error}</p>
      ) : products.length === 0 ? (
        <p className={`${APP_COLORS.neutral700}`}>No se encontraron productos para tu búsqueda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.ean} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage; 