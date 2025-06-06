
import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { Product, Supermarket, ProductPrice, CartItem as GlobalCartItem } from '../types';
import { getProductByEan, getSupermarkets, getProductPrice, MOCK_PRODUCTS, MOCK_PRODUCT_PRICES, MOCK_SUPERMARKETS } from '../services/mockData';
import SupermarketCartDisplay from '../components/SupermarketCartDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { generateStoryFromCart } from '../services/geminiService';
import { Icons, MASONLINE_COLORS } from '../../constants';
import { GroundingChunk } from '../types';


interface ProductInCart extends Product {
  quantity: number;
}

interface SupermarketCartData {
  supermarket: Supermarket;
  items: Array<{ product: Product; quantity: number; price: number }>;
  total: number;
  availableItemsCount: number;
}

const CartPage: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const [detailedCartItems, setDetailedCartItems] = useState<ProductInCart[]>([]);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [allProductPrices, setAllProductPrices] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const [story, setStory] = useState<string | null>(null);
  const [storySources, setStorySources] = useState<GroundingChunk[] | undefined>(undefined);
  const [storyLoading, setStoryLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [smData, pData, ppData] = await Promise.all([
          getSupermarkets(), // MOCK_SUPERMARKETS directly
          Promise.all(cartState.items.map(item => getProductByEan(item.ean))), // MOCK_PRODUCTS used by getProductByEan
          Promise.resolve(MOCK_PRODUCT_PRICES) // MOCK_PRODUCT_PRICES directly
        ]);
        
        setSupermarkets(smData);
        setAllProductPrices(ppData);

        const validProducts = pData.filter(p => p !== undefined) as Product[];
        const cartItemsWithDetails = cartState.items.map(cartItem => {
          const productDetail = validProducts.find(p => p.ean === cartItem.ean);
          return productDetail ? { ...productDetail, quantity: cartItem.quantity } : null;
        }).filter(item => item !== null) as ProductInCart[];
        
        setDetailedCartItems(cartItemsWithDetails);

      } catch (error) {
        console.error("Error loading cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [cartState.items]);

  const supermarketCartsData = useMemo((): SupermarketCartData[] => {
    if (loading || detailedCartItems.length === 0) return [];

    return supermarkets.map(sm => {
      const itemsInThisSupermarket: Array<{ product: Product; quantity: number; price: number }> = [];
      let total = 0;
      
      detailedCartItems.forEach(cartProduct => {
        const priceEntry = allProductPrices.find(pp => pp.ean === cartProduct.ean && pp.supermarket_id === sm.supermarket_id);
        if (priceEntry) {
          itemsInThisSupermarket.push({
            product: cartProduct,
            quantity: cartProduct.quantity,
            price: priceEntry.price,
          });
          total += priceEntry.price * cartProduct.quantity;
        }
      });
      
      // Only include supermarket if it has at least one item from the cart
      if (itemsInThisSupermarket.length > 0) {
          return {
            supermarket: sm,
            items: itemsInThisSupermarket,
            total: total,
            availableItemsCount: itemsInThisSupermarket.length,
          };
      }
      return null; // This supermarket has no items from the cart
    }).filter(smCart => smCart !== null) as SupermarketCartData[]; // Filter out nulls

  }, [detailedCartItems, supermarkets, allProductPrices, loading]);


  const handleGenerateStory = async () => {
    if (detailedCartItems.length === 0) return;
    setStoryLoading(true);
    setStory(null);
    setStorySources(undefined);
    const productNames = detailedCartItems.map(item => item.name);
    const result = await generateStoryFromCart(productNames);
    setStory(result.text);
    setStorySources(result.sources);
    setStoryLoading(false);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Icons.ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-semibold text-gray-700 mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-8">Parece que aún no has agregado productos. ¡Explora nuestras ofertas!</p>
        <Link 
          to="/" 
          className={`${MASONLINE_COLORS.primaryRed} text-white py-3 px-8 rounded-md text-lg font-semibold hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-mason-red/50`}
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 lg:mb-0">Tu Carrito de Compras</h1>
        {cartState.items.length > 0 && (
             <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center border border-red-500 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
            >
                <Icons.Trash className="w-4 h-4 mr-1.5" /> Vaciar Carrito Global
            </button>
        )}
      </div>

      {supermarketCartsData.length === 0 && !loading && (
        <p className="text-center text-gray-600 bg-yellow-50 p-6 rounded-md shadow">
          Ninguno de los productos en tu carrito está disponible en los supermercados registrados, o no se encontraron precios.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {supermarketCartsData.sort((a,b) => a.total - b.total).map(smCartData => ( // Sort by cheapest total
            <SupermarketCartDisplay
              key={smCartData.supermarket.supermarket_id}
              supermarket={smCartData.supermarket}
              items={smCartData.items}
              totalCartProductsCount={detailedCartItems.length}
            />
          ))}
        </div>

        <div className="lg:col-span-1 sticky top-24">
           {detailedCartItems.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-xl border border-mason-blue">
              <h3 className="text-xl font-semibold text-mason-dark mb-4 flex items-center">
                <Icons.Sparkles className={`w-6 h-6 mr-2 ${MASONLINE_COLORS.textSecondaryBlue}`} />
                Historia de tu Carrito
              </h3>
              <button
                onClick={handleGenerateStory}
                disabled={storyLoading}
                className={`${MASONLINE_COLORS.secondaryBlue} text-white py-2 px-4 rounded-md w-full hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-mason-blue/50 disabled:opacity-50`}
              >
                {storyLoading ? 'Creando historia...' : '¡Crear historia con Gemini!'}
              </button>
              {storyLoading && (
                <div className="mt-4 flex justify-center">
                  <LoadingSpinner />
                </div>
              )}
              {story && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-sm text-gray-700">{story}</p>
                   {storySources && storySources.length > 0 && (
                     <div className="mt-3 pt-2 border-t border-blue-100">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Fuentes (Google Search):</p>
                        <ul className="list-disc list-inside space-y-1">
                            {storySources.map((source, index) => {
                                 const uri = source.web?.uri || source.retrievedContext?.uri;
                                 const title = source.web?.title || source.retrievedContext?.title || uri;
                                 if (!uri) return null;
                                 return (
                                    <li key={index} className="text-xs">
                                        <a href={uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {title || uri}
                                        </a>
                                    </li>
                                 );
                            })}
                        </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-xl border border-gray-200">
            <h3 className="text-xl font-semibold text-mason-dark mb-4">Resumen Global</h3>
            <p className="text-gray-600">Total de productos únicos en carrito: {detailedCartItems.length}</p>
            <p className="text-gray-600">Total de ítems (con cantidades): {cartState.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
            <p className="mt-4 text-sm text-gray-500">
              Compara los subtotales de cada supermercado para encontrar la mejor opción para tu compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
