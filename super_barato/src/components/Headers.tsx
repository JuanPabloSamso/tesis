
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import CategoryLinks from './CategoryLinks';
import { Icons, MASONLINE_COLORS } from '../../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className={`${MASONLINE_COLORS.primaryRed} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <Link to="/" className="text-3xl font-bold tracking-tight">
            SuperBarato
          </Link>
          <div className="w-full sm:w-auto flex-grow sm:flex-grow-0 sm:mx-4 order-last sm:order-none mt-3 sm:mt-0">
            <SearchBar />
          </div>
          <div className="flex items-center space-x-4">
            {/* Placeholder for User Icon/Login */}
            <button className="flex items-center p-2 hover:bg-mason-red/80 rounded-md transition-colors">
              <Icons.User className="w-7 h-7" />
            </button>
            <CartIcon />
          </div>
        </div>
      </div>
      <CategoryLinks />
    </header>
  );
};

export default Header;
