
import React from 'react';
import { Icons } from '../../constants';

const SearchBar: React.FC = () => {
  return (
    <div className="relative flex-grow max-w-xl">
      <input
        type="search"
        placeholder="Buscar productos, marcas y más..."
        className="w-full py-2.5 pl-4 pr-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mason-red/50 focus:border-mason-red"
      />
      <button className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 bg-gray-100 rounded-r-md hover:bg-gray-200">
        <Icons.Search className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;
