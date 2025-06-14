import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import CategoryLinks from './CategoryLinks';
import { Icons, APP_COLORS } from '../../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50">
      <div className={`${APP_COLORS.primaryBlue} text-white shadow-lg`}>
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="flex items-center space-x-2">
            {/* Replace with your logo/icon if desired */}
            <span className="text-2xl font-bold">SuperBarato</span>
          </Link>

          <div className="flex-grow flex justify-center mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-4">
            <button className={`flex items-center p-2 hover:${APP_COLORS.primaryBlueDark} rounded-md transition-colors`}>
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
