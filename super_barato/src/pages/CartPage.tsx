import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { Product, Supermarket, ProductPrice, CartItem as GlobalCartItem } from '../../types';
import { getProductByEan, getSupermarkets, quoteCart } from '../services/api';
import SupermarketCartDisplay from '../components/SupermarketCartDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import { Icons, APP_COLORS } from '../../constants';
import { GroundingChunk } from '../../types';


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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [smData, pData] = await Promise.all([
          getSupermarkets(), // MOCK_SUPERMARKETS directly
          Promise.all(cartState.items.map(item => getProductByEan(item.ean))), // MOCK_PRODUCTS used by getProductByEan
        ]);
        
        setSupermarkets(smData as Supermarket[]);

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

    // LOGS PARA DEPURACIÓN
    console.log("supermarkets", supermarkets);
    console.log("detailedCartItems", detailedCartItems);

    return supermarkets.map(sm => {
      const itemsInThisSupermarket: Array<{ product: Product; quantity: number; price: number }> = [];
      let total = 0;
      
      detailedCartItems.forEach(cartProduct => {
        // Comparación robusta de supermarket_id
        const priceEntry = cartProduct.prices?.find(pp => String(pp.supermarket_id) === String(sm.supermarket_id));
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

  }, [detailedCartItems, supermarkets, loading]);


  // Calculate most economical option and estimated savings
  const { mostEconomicalCart, highestCartTotal, estimatedSavings } = useMemo(() => {
    if (supermarketCartsData.length === 0) {
      return { mostEconomicalCart: null, highestCartTotal: 0, estimatedSavings: 0 };
    }

    // Sort by availability first, then by total price
    const sortedCarts = [...supermarketCartsData].sort((a, b) => {
      const aHasAllProducts = a.availableItemsCount === detailedCartItems.length;
      const bHasAllProducts = b.availableItemsCount === detailedCartItems.length;

      if (aHasAllProducts !== bHasAllProducts) {
        return aHasAllProducts ? -1 : 1;
      }

      if (a.availableItemsCount !== b.availableItemsCount) {
        return b.availableItemsCount - a.availableItemsCount;
      }
      
      return a.total - b.total;
    });

    const cheapestCart = sortedCarts[0];
    const highestTotal = Math.max(...supermarketCartsData.map(cart => cart.total));
    const savings = highestTotal - cheapestCart.total;

    return {
      mostEconomicalCart: cheapestCart,
      highestCartTotal: highestTotal,
      estimatedSavings: savings,
    };
  }, [supermarketCartsData, detailedCartItems.length]);


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
        <h1 className={`text-3xl font-semibold ${APP_COLORS.neutral700} mb-4`}>Tu carrito está vacío</h1>
        <p className={`${APP_COLORS.neutral500} mb-8`}>Parece que aún no has agregado productos. ¡Explora nuestras ofertas!</p>
        <Link 
          to="/" 
          className={`${APP_COLORS.primaryBlue} text-white py-3 px-8 rounded-md text-lg font-semibold hover:${APP_COLORS.primaryBlueDark} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  // Verificar si hay productos sin precios
  const productsWithoutPrices = detailedCartItems.filter(item => !item.prices || item.prices.length === 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <h1 className={`text-3xl font-bold ${APP_COLORS.neutral800} mb-4 lg:mb-0`}>Tu Carrito de Compras</h1>
        {cartState.items.length > 0 && (
             <button
                onClick={clearCart}
                className="text-sm border border-red-500 text-red-600 hover:text-red-700 bg-transparent hover:bg-transparent font-medium flex items-center px-3 py-1.5 rounded-md transition-colors"
            >
                <Icons.Trash className="w-4 h-4 mr-1.5" /> Vaciar Carrito Global
            </button>
        )}
      </div>

      {productsWithoutPrices.length > 0 && (
        <div className={`${APP_COLORS.actionRedLight} border border-[#EF4444] rounded-lg p-4 mb-6`}>
          <h3 className={`text-lg font-semibold ${APP_COLORS.actionRed} mb-2`}>Productos sin precios disponibles</h3>
          <p className={`${APP_COLORS.actionRed} mb-2`}>Los siguientes productos no tienen precios registrados en ningún supermercado:</p>
          <ul className="list-disc list-inside text-yellow-700">
            {productsWithoutPrices.map(product => (
              <li key={product.ean}>{product.name}</li>
            ))}
          </ul>
        </div>
      )}

      {supermarketCartsData.length === 0 && !loading && (
        <div className={`${APP_COLORS.actionRedLight} border border-[#EF4444] rounded-lg p-6 text-center`}>
          <h3 className={`text-lg font-semibold ${APP_COLORS.actionRed} mb-2`}>No hay productos disponibles</h3>
          <p className={`${APP_COLORS.actionRed}`}>
            Ninguno de los productos en tu carrito está disponible en los supermercados registrados, o no se encontraron precios.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {supermarketCartsData
            .sort((a, b) => {
              // First sort by availability (all products available first)
              const aHasAllProducts = a.availableItemsCount === detailedCartItems.length;
              const bHasAllProducts = b.availableItemsCount === detailedCartItems.length;
              
              // If one has all products and the other doesn't, prioritize the complete one
              if (aHasAllProducts !== bHasAllProducts) {
                return aHasAllProducts ? -1 : 1;
              }
              
              // If both have the same availability status, sort by:
              // 1. Number of available items (more is better)
              // 2. Total price (cheaper is better)
              if (a.availableItemsCount !== b.availableItemsCount) {
                return b.availableItemsCount - a.availableItemsCount;
              }
              
              return a.total - b.total;
            })
            .map(smCartData => (
            <SupermarketCartDisplay
              key={smCartData.supermarket.supermarket_id}
              supermarket={smCartData.supermarket}
              items={smCartData.items}
              totalCartProductsCount={detailedCartItems.length}
              isEconomicalOption={mostEconomicalCart?.supermarket.supermarket_id === smCartData.supermarket.supermarket_id}
            />
          ))}
        </div>

        <div className="lg:col-span-1 sticky top-24 space-y-6">
          <div className={`${APP_COLORS.neutralWhite} p-6 rounded-lg shadow-xl border ${APP_COLORS.borderNeutral200}`}>
            <h3 className={`text-xl font-semibold ${APP_COLORS.neutral800} mb-4`}>Resumen Global</h3>
            <p className={`${APP_COLORS.neutral700}`}>Total de productos únicos en carrito: {detailedCartItems.length}</p>
            <p className={`${APP_COLORS.neutral700}`}>Total de ítems (con cantidades): {cartState.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
            
            {estimatedSavings > 0 && highestCartTotal > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-200"> {/* Added border-t for separation */}
                <h3 className={`text-xl font-semibold ${APP_COLORS.neutral800} mb-2 flex items-center`}>
                  <Icons.Sparkles className={`w-6 h-6 mr-2 ${APP_COLORS.textAccentGreen}`} />
                  Tu Ahorro Estimado:
                </h3>
                <p className={`${APP_COLORS.neutral700} mb-2`}>Comparado con comprar todos los productos al precio más alto disponible individualmente.</p>
                <div className="flex justify-between items-center">
                  <p className={`${APP_COLORS.neutral700} font-medium`}>Tu Ahorro Potencial:</p>
                  <span className={`text-2xl font-bold ${APP_COLORS.textAccentGreen}`}>${estimatedSavings.toFixed(2)}</span>
                </div>
              </div>
            )}

            <p className={`mt-4 text-sm ${APP_COLORS.neutral500}`}>
              Compara los subtotales de cada supermercado para encontrar la mejor opción para tu compra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 