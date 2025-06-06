
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product, ProductPrice, Supermarket } from '../../types';
import { getProductByEan, getProductPricesByEan, getSupermarketById } from '../services/mockData';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
// import GeminiProductAssistant from '../components/GeminiProductAssistant'; // Removed
import { MASONLINE_COLORS } from '../../constants';

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
          const priceData = await getProductPricesByEan(ean);
          const detailedPrices: ProductPriceDetail[] = await Promise.all(
            priceData.map(async (pp) => {
              const supermarket = await getSupermarketById(pp.supermarket_id);
              return { ...pp, supermarketName: supermarket?.name || 'Desconocido' };
            })
          );
          detailedPrices.sort((a,b) => a.price - b.price); // Sort by price ascending
          setPrices(detailedPrices);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
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
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Producto no encontrado.</div>;
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
              className={`w-full ${MASONLINE_COLORS.primaryRed} text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-mason-red/50`}
            >
              Agregar al Carrito
            </button>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Precios por Supermercado:</h2>
              {prices.length > 0 ? (
                <ul className="space-y-2">
                  {prices.map((priceDetail, index) => (
                    <li key={priceDetail.supermarket_id} className={`flex justify-between items-center p-3 rounded-md ${index === 0 ? 'bg-green-100 border-green-500 border-2' : 'bg-gray-50 border'}`}>
                      <span className={`font-medium ${index === 0 ? 'text-green-700' : 'text-gray-700'}`}>{priceDetail.supermarketName}</span>
                      <span className={`font-bold text-lg ${index === 0 ? 'text-green-600' : MASONLINE_COLORS.darkText}`}>
                        ${priceDetail.price.toFixed(2)}
                        {index === 0 && <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-green-500 text-white rounded-full">Más barato</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Este producto no está disponible en los supermercados registrados o no se encontraron precios.</p>
              )}
            </div>
          </div>
        </div>
        {/* <GeminiProductAssistant productName={product.name} /> Removed */}
      </div>
    </div>
  );
};

export default ProductDetailPage;