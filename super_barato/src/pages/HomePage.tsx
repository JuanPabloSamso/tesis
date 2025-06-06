
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts } from '../services/mockData';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
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
      <div className="mb-8 p-6 bg-mason-red text-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-2">¡Bienvenido a SuperBarato!</h1>
        <p className="text-lg">Tu comparador de precios inteligente. Encuentra los mejores precios en tus productos favoritos.</p>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Productos Destacados</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No hay productos para mostrar en este momento.</p>
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
