import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product, Category as CategoryType } from '../types';
import { getProductsByCategoryId, getCategoryById } from '../services/mockData';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return;
      try {
        setLoading(true);
        const catData = await getCategoryById(categoryId);
        setCategory(catData || null); // Set to null if not found
        const productData = await getProductsByCategoryId(categoryId);
        setProducts(productData);
      } catch (error) {
        console.error("Failed to fetch category data:", error);
        setCategory(null); // Ensure category is null on error
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  const getCategoryDisplayName = (cat: CategoryType | null) => {
    if (!cat) return "Categoría Desconocida";
    // Only display the main category name
    return cat.category; 
  };
  
  // If categoryId is undefined (e.g. direct access to /category/ without an ID, handled by App.tsx to show HomePage),
  // this page won't be rendered with that state. This is for when categoryId is present.
  const displayName = getCategoryDisplayName(category);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {displayName}
      </h1>
      {products.length === 0 && !loading ? (
        <p className="text-gray-600">No hay productos en esta categoría.</p>
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

export default CategoryPage;