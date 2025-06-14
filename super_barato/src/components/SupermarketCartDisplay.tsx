import React from 'react';
import { Link } from 'react-router-dom';
import { Product, Supermarket } from '../../types';
import { Icons, APP_COLORS } from '../../constants';
import { useCart } from '../contexts/CartContext';

export interface ItemInSupermarketCart {
  product: Product;
  quantity: number;
  price: number; // Price in this specific supermarket
}

interface SupermarketCartDisplayProps {
  supermarket: Supermarket;
  items: ItemInSupermarketCart[];
  totalCartProductsCount: number; // Total unique products in the global cart
  isEconomicalOption?: boolean; // New prop to indicate if this is the most economical option
}

const SupermarketCartDisplay: React.FC<SupermarketCartDisplayProps> = ({
  supermarket,
  items,
  totalCartProductsCount,
  isEconomicalOption = false, // Default to false
}) => {
  const { removeFromCart, updateQuantity } = useCart();

  if (items.length === 0) {
    return null; // Don't render if no items for this supermarket
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const availableItemsCount = items.length;

  return (
    <div className={`p-6 rounded-lg shadow-md mb-6
      ${isEconomicalOption ? `${APP_COLORS.semanticFreshBorder} border-2` : `${APP_COLORS.neutralWhite} border ${APP_COLORS.borderNeutral200}`}
    `}>
      <div className={`py-2 px-4 -mx-6 -mt-6 rounded-t-lg flex items-center mb-4
        ${isEconomicalOption ? APP_COLORS.semanticFreshBg : ''}
      `}>
        {isEconomicalOption && <Icons.CheckCircle className={`w-5 h-5 mr-2 ${APP_COLORS.semanticFreshText}`} />}
        <h3 className={`text-xl font-semibold 
          ${isEconomicalOption ? APP_COLORS.semanticFreshText : APP_COLORS.neutral800}
        `}>{supermarket.name}</h3>
      </div>
      <p className={`text-sm ${APP_COLORS.neutral500} mb-4`}>
        {availableItemsCount} de {totalCartProductsCount} producto(s) de tu carrito disponibles aquí.
      </p>
      
      <div className="space-y-4">
        {items.map(item => {
          return (
            <div key={item.product.ean} className="flex items-start sm:items-center space-x-3 sm:space-x-4 pb-4 border-b border-[#E5E7EB] last:border-b-0">
              <img 
                src={item.product.image_url} 
                alt={item.product.name} 
                className="w-16 h-16 object-cover rounded flex-shrink-0"
                onError={(e) => (e.currentTarget.src = 'https://picsum.photos/seed/cartitem/100/100')}
              />
              <div className="flex-grow">
                <Link to={`/product/${item.product.ean}`} className={`font-medium ${APP_COLORS.neutral800} hover:${APP_COLORS.textCtaOrange} text-sm sm:text-base`}>
                  {item.product.name}
                </Link>
                <div className={`text-xs sm:text-sm ${APP_COLORS.neutral500} mt-0.5`}>
                  Precio unitario: 
                  <span className={`ml-1`}>${item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center mt-2">
                  <label htmlFor={`quantity-${item.product.ean}-${supermarket.supermarket_id}`} className={`text-xs sm:text-sm mr-1.5 ${APP_COLORS.neutral700}`}>Cant:</label>
                  <input
                    type="number"
                    id={`quantity-${item.product.ean}-${supermarket.supermarket_id}`}
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.product.ean, parseInt(e.target.value))}
                    className={`w-16 p-1 border ${APP_COLORS.borderNeutral300} rounded-md text-xs sm:text-sm`}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-semibold ${APP_COLORS.neutral800} text-sm sm:text-base`}>${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart(item.product.ean)}
                  className="text-xs border border-red-500 text-red-600 hover:text-red-700 bg-transparent hover:bg-transparent mt-1 px-2 py-1 rounded transition-colors"
                  title="Quitar producto del carrito global"
                >
                  <Icons.Trash className="w-3.5 h-3.5 inline-block mr-0.5"/> Quitar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-6 pt-4 border-t ${APP_COLORS.borderNeutral300}`}>
        <div className="flex justify-between items-center">
          <p className={`text-lg font-semibold ${APP_COLORS.neutral700}`}>Subtotal en {supermarket.name}:</p>
          <p className={`text-2xl font-bold ${APP_COLORS.textCtaOrange}`}>${subtotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SupermarketCartDisplay;
