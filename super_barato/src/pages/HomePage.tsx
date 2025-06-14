import React, { useState, useEffect } from 'react';
import { getProducts, Product } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { APP_COLORS } from '../../constants';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      <h2 className={`text-2xl font-semibold ${APP_COLORS.neutral800} mb-6`}>Productos Destacados</h2>
      {error ? (
        <p className={`${APP_COLORS.actionRed}`}>{error}</p>
      ) : products.length === 0 ? (
        <p className={`${APP_COLORS.neutral700}`}>No hay productos para mostrar en este momento.</p>
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

export default HomePage;
