import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product, ProductPrice, Supermarket } from '../../types';
import { getProductByEan } from '../services/api';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
// import GeminiProductAssistant from '../components/GeminiProductAssistant'; // Removed
import { APP_COLORS } from '../../constants';

interface ProductPriceDetail extends ProductPrice {
  supermarketName: string;
}

const ProductDetailPage: React.FC = () => {
  const { ean } = useParams<{ ean: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [prices, setPrices] = useState<ProductPriceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!ean) return;
      try {
        setLoading(true);
        const productData = await getProductByEan(ean);
        setProduct(productData || null);

        if (productData) {
          console.log("Product Data received in ProductDetailPage:", productData);
          if (productData.prices) {
            console.log("Product Prices received in ProductDetailPage:", productData.prices);
            const detailedPrices: ProductPriceDetail[] = productData.prices.map(pp => ({
              ...pp,
              supermarketName: pp.supermarket,
            }));
            detailedPrices.sort((a,b) => a.price - b.price);
            setPrices(detailedPrices);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [ean]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Producto no encontrado</h2>
          <p className="text-red-600 mb-4">El producto que estás buscando no existe en nuestra base de datos o no está disponible en este momento.</p>
          <Link 
            to="/" 
            className={`inline-block ${APP_COLORS.actionRed} text-white px-6 py-2 rounded-md hover:${APP_COLORS.actionRedHover} transition-colors`}
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-auto max-h-[500px] object-contain rounded-lg border"
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/600/400?grayscale')}
            />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Cantidad:</label>
              <input 
                type="number" 
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 p-2 border border-gray-300 rounded-md focus:ring-mason-red focus:border-mason-red"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full ${APP_COLORS.primaryBlue} text-white py-3 px-6 rounded-md text-lg font-semibold hover:${APP_COLORS.primaryBlueDark} transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50`}
            >
              Agregar al Carrito
            </button>

            <h2 className={`text-2xl font-bold ${APP_COLORS.neutral800} mt-8 mb-4`}>Precios en Supermercados</h2>
            {
              prices.length > 0 ? (
                <ul className="space-y-3">
                  {prices.map((price, index) => (
                    <li key={price.supermarket_id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <span className={`font-bold text-lg ${index === 0 ? APP_COLORS.accentGreen : APP_COLORS.neutral700}`}>{price.supermarketName}</span>
                      <span className={`text-xl font-bold ${index === 0 ? APP_COLORS.accentGreen : APP_COLORS.neutral800}`}>${Number(price.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`${APP_COLORS.neutral500}`}>No hay precios disponibles para este producto en ningún supermercado.</p>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;