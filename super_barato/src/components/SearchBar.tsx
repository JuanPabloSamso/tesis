import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons, APP_COLORS } from '../../constants';
import { searchProducts } from '../services/api';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const results = await searchProducts(searchTerm);
      // Navigate to search results page with the search term
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-grow max-w-xl">
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar productos, marcas y más..."
        className={`w-full py-2.5 pl-4 pr-10 text-sm ${APP_COLORS.neutral700} ${APP_COLORS.neutralWhite} border ${APP_COLORS.borderNeutral300} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB]`}
      />
      <button 
        type="submit"
        className={`absolute inset-y-0 right-0 flex items-center justify-center px-3 ${APP_COLORS.neutral500} ${APP_COLORS.neutral100} rounded-r-md hover:${APP_COLORS.neutral200}`}
      >
        <Icons.Search className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBar;
