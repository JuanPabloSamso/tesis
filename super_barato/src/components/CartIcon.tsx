
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Icons } from '../../constants';

const CartIcon: React.FC = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link to="/cart" className="relative flex items-center p-2 text-white hover:bg-mason-red/80 rounded-md transition-colors">
      <Icons.ShoppingCart className="w-7 h-7" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-mason-red bg-white rounded-full">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
