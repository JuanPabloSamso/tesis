import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { APP_COLORS } from '../../constants';

const CategoryLinks: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories((data as string[]) || []);
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
    <nav className={`${APP_COLORS.neutralWhite} shadow-sm`}>
      <div className="container mx-auto px-4 py-2 flex space-x-4 overflow-x-auto">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/category/${cat}`}
            className={`px-3 py-2 text-sm font-medium ${APP_COLORS.neutral700} hover:${APP_COLORS.textCtaOrange} whitespace-nowrap transition-colors`}
          >
            {cat}
          </Link>
        ))}
         <Link
            to={`/`}
            className={`px-3 py-2 text-sm font-medium ${APP_COLORS.neutral700} hover:${APP_COLORS.textCtaOrange} whitespace-nowrap transition-colors`}
          >
            Ver Todos
          </Link>
      </div>
    </nav>
  );
};

export default CategoryLinks;