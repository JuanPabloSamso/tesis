
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { getCheapestPriceForProduct } from '../services/mockData';
import { MASONLINE_COLORS } from '../../constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const cheapestPrice = getCheapestPriceForProduct(product.ean);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl">
      <Link to={`/product/${product.ean}`} className="block">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
          onError={(e) => (e.currentTarget.src = 'https://picsum.photos/400/300?grayscale')}
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={product.name}>
          <Link to={`/product/${product.ean}`} className="hover:text-mason-red">{product.name}</Link>
        </h3>
        <p className="text-xs text-gray-500 mb-2 h-10 overflow-hidden">{product.description}</p>
        
        <div className="mt-auto">
          {cheapestPrice !== null ? (
            <p className="text-xl font-bold text-mason-dark mb-3">
              Desde ${cheapestPrice.toFixed(2)}
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-3">Precio no disponible</p>
          )}
          <button
            onClick={handleAddToCart}
            className={`w-full ${MASONLINE_COLORS.secondaryBlue} text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-mason-blue/50`}
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
