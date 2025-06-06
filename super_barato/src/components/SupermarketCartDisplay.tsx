
import React from 'react';
import { Link } from 'react-router-dom';
import { Product, Supermarket, ProductPrice } from '../types';
import { Icons } from '../../constants';
import { useCart } from '../contexts/CartContext';

interface ItemInSupermarketCart {
  product: Product;
  quantity: number;
  price: number; // Price in this specific supermarket
}

interface SupermarketCartDisplayProps {
  supermarket: Supermarket;
  items: ItemInSupermarketCart[];
  totalCartProductsCount: number; // Total unique products in the global cart
}

const SupermarketCartDisplay: React.FC<SupermarketCartDisplayProps> = ({ supermarket, items, totalCartProductsCount }) => {
  const { removeFromCart, updateQuantity } = useCart();

  if (items.length === 0) {
    return null; // Don't render if no items for this supermarket
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const availableItemsCount = items.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-mason-dark mb-1">{supermarket.name}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {availableItemsCount} de {totalCartProductsCount} producto(s) de tu carrito disponibles aquí.
      </p>
      
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.product.ean} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
            <img 
              src={item.product.image_url} 
              alt={item.product.name} 
              className="w-16 h-16 object-cover rounded"
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/cartitem/100/100')}
            />
            <div className="flex-grow">
              <Link to={`/product/${item.product.ean}`} className="font-medium text-gray-800 hover:text-mason-red">
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-500">Precio unitario: ${item.price.toFixed(2)}</p>
              <div className="flex items-center mt-1">
                <label htmlFor={`quantity-${item.product.ean}-${supermarket.supermarket_id}`} className="text-sm mr-2">Cant:</label>
                <input
                  type="number"
                  id={`quantity-${item.product.ean}-${supermarket.supermarket_id}`}
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(item.product.ean, parseInt(e.target.value))}
                  className="w-16 p-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
              <button 
                onClick={() => removeFromCart(item.product.ean)}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
                title="Quitar producto del carrito global"
              >
                <Icons.Trash className="w-4 h-4 inline-block mr-1"/> Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-700">Subtotal en {supermarket.name}:</p>
          <p className="text-2xl font-bold text-mason-red">${subtotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SupermarketCartDisplay;
