import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../contexts/CartContext';
import { getCheapestPriceForProduct } from '../services/api';
import { APP_COLORS, Icons } from '../../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const cheapestPrice = getCheapestPriceForProduct(
    (product.prices || []).map(p => ({ price: p.price }))
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className={`${APP_COLORS.neutralWhite} rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl h-full group`}>
      <Link to={`/product/${product.ean}`} className="block relative aspect-[3/4]">
        <img 
          src={product.image_url || 'https://picsum.photos/300/400?grayscale'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/300/400?grayscale')}
        />
      </Link>
      <div className="p-2.5 flex flex-col flex-grow">
        <h3 className={`text-xs font-normal ${APP_COLORS.neutral700} mb-1.5 truncate h-4`} title={product.name}>
          <Link to={`/product/${product.ean}`} className={`hover:${APP_COLORS.textCtaOrange}`}>{product.name}</Link>
        </h3>
        
        <div className="mt-auto">
          {cheapestPrice !== null ? (
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className={`text-[10px] lowercase ${APP_COLORS.neutral500} -mb-1 leading-none`}>desde</span>
                <p className={`text-base font-bold ${APP_COLORS.textCtaOrange}`}>
                  ${cheapestPrice.toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                className={`p-1.5 border ${APP_COLORS.borderNeutral300} rounded-md ${APP_COLORS.neutral700} hover:bg-[#F3F4F6] hover:${APP_COLORS.textCtaOrange} focus:outline-none focus:ring-1 focus:ring-cta-orange/50 focus:border-[#F97316] transition-colors`}
                aria-label={`Agregar ${product.name} al carrito`}
              >
                <Icons.ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <p className={`text-sm ${APP_COLORS.neutral500} h-8 flex items-center`}>Precio no disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
