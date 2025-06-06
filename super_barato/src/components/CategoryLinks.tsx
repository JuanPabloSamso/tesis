import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { getCategories } from '../services/mockData';
import LoadingSpinner from './LoadingSpinner';

interface UniqueCategoryLink {
  displayName: string;
  linkId: string;
}

const CategoryLinks: React.FC = () => {
  const [uniqueCategories, setUniqueCategories] = useState<UniqueCategoryLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        
        const processedCategories: UniqueCategoryLink[] = [];
        const seenMainCategories = new Set<string>();

        data.forEach(cat => {
          if (!seenMainCategories.has(cat.category)) {
            seenMainCategories.add(cat.category);
            processedCategories.push({
              displayName: cat.category,
              linkId: cat.category_id, // Link to the first specific category_id for this main category
            });
          }
        });
        setUniqueCategories(processedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-10">
        <LoadingSpinner size="h-6 w-6" />
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex space-x-4 overflow-x-auto">
        {uniqueCategories.map((category) => (
          <Link
            key={category.linkId} // Use unique linkId which corresponds to a category_id
            to={`/category/${category.linkId}`}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-mason-red whitespace-nowrap transition-colors"
          >
            {category.displayName}
          </Link>
        ))}
         <Link
            to={`/`}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-mason-red whitespace-nowrap transition-colors"
          >
            Ver Todos
          </Link>
      </div>
    </nav>
  );
};

export default CategoryLinks;