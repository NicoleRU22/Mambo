import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cartService } from '@/services/api';
import { getLocalCart } from '@/utils/cartLocal';

interface CartItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

interface FloatingCartProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ isOpen, onClose, onItemAdded }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated) {
        loadCart();
      } else {
        const localCart = getLocalCart();
        setCartItems(localCart.map(item => ({
          id: item.productId,
          product_name: '',
          price: 0,
          quantity: item.quantity,
          image: '',
        })));
        setSummary({
          subtotal: 0,
          shipping: 0,
          total: 0,
          itemCount: localCart.reduce((sum, item) => sum + item.quantity, 0),
        });
      }
    }
  }, [isOpen, isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCartItems(cartData.items || []);
      setSummary(cartData.summary || {
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: 0
      });
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? 'bg-black bg-opacity-50' : 'bg-transparent pointer-events-none'
      }`}
    >
      <div
        className={`transform transition-transform duration-300 ease-in-out bg-white w-full max-w-md shadow-xl h-full flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold">Carrito de Compras</h2>
            {summary.itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {summary.itemCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body scrollable */}
        <div className="p-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando carrito...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400">Agrega productos para continuar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      S/.{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-semibold">S/.{summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío:</span>
              <span className="font-semibold">
                {summary.shipping === 0 ? 'Gratis' : `S/.${summary.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>S/.{summary.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                Proceder al Pago
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={handleViewCart} className="w-full">
                Ver Carrito Completo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingCart;
