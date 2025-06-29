import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cartService, orderService, userService } from '@/services/api';
import Swal from 'sweetalert2';

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

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  });
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadCheckoutData();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      
      // Cargar carrito
      const cartData = await cartService.getCart();
      setCartItems(cartData.items || []);
      setSummary(cartData.summary || {
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: 0
      });

      // Cargar perfil del usuario
      const profileData = await userService.getProfile();
      setUserProfile({
        name: profileData.name || user?.name || '',
        email: profileData.email || user?.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zipCode: profileData.zipCode || ''
      });
    } catch (error) {
      console.error('Error loading checkout data:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al cargar los datos del checkout',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setProcessing(true);

    try {
      const checkoutData = {
        shipping_address: `${userProfile.address}, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}`,
        billing_address: `${userProfile.address}, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}`,
        payment_method: paymentMethod,
        contact_phone: userProfile.phone,
        contact_email: userProfile.email,
        shipping_method: shippingMethod,
        notes: ((e.target as HTMLFormElement).elements.namedItem('notes') as HTMLTextAreaElement)?.value || ''
      };

      const orderResult = await orderService.checkout(checkoutData);
      
      Swal.fire({
        title: '¡Pedido realizado con éxito!',
        text: `Tu pedido #${orderResult.order_number} ha sido confirmado`,
        icon: 'success',
        confirmButtonText: 'Ver Pedido'
      }).then(() => {
        navigate('/payment-success', { 
          state: { orderNumber: orderResult.order_number }
        });
      });

    } catch (error) {
      console.error('Error processing checkout:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al procesar el pedido. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setProcessing(false);
    }
  };

  const calculateShipping = () => {
    if (shippingMethod === 'express') {
      return 15.99;
    }
    return summary.subtotal > 50 ? 0 : 8.99;
  };

  const shippingCost = calculateShipping();
  const tax = summary.subtotal * 0.08; // 8% tax
  const total = summary.subtotal + shippingCost + tax;

  if (!isAuthenticated) {
    return null; // Ya se redirige en useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p>Cargando checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-6">Agrega productos antes de proceder al checkout</p>
            <Button onClick={() => navigate('/catalog')}>
              Ir al Catálogo
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Pago 100% seguro y protegido</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="h-5 w-5" />
                    <span>Información de Envío</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre *</Label>
                      <Input 
                        id="firstName" 
                        value={userProfile.name.split(' ')[0] || ''}
                        onChange={(e) => setUserProfile({
                          ...userProfile, 
                          name: e.target.value + ' ' + (userProfile.name.split(' ').slice(1).join(' ') || '')
                        })}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido *</Label>
                      <Input 
                        id="lastName" 
                        value={userProfile.name.split(' ').slice(1).join(' ') || ''}
                        onChange={(e) => setUserProfile({
                          ...userProfile, 
                          name: (userProfile.name.split(' ')[0] || '') + ' ' + e.target.value
                        })}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Dirección *</Label>
                    <Input 
                      id="address" 
                      value={userProfile.address}
                      onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad *</Label>
                      <Input 
                        id="city" 
                        value={userProfile.city}
                        onChange={(e) => setUserProfile({...userProfile, city: e.target.value})}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado/Provincia *</Label>
                      <Input 
                        id="state" 
                        value={userProfile.state}
                        onChange={(e) => setUserProfile({...userProfile, state: e.target.value})}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal *</Label>
                      <Input 
                        id="zipCode" 
                        value={userProfile.zipCode}
                        onChange={(e) => setUserProfile({...userProfile, zipCode: e.target.value})}
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notas para la entrega (opcional)</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Instrucciones especiales para la entrega..."
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Envío Estándar</p>
                            <p className="text-sm text-gray-500">5-7 días hábiles</p>
                          </div>
                          <span className="font-medium">
                            {summary.subtotal > 50 ? 'Gratis' : 'S/.8.99'}
                          </span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Envío Express</p>
                            <p className="text-sm text-gray-500">2-3 días hábiles</p>
                          </div>
                          <span className="font-medium">S/.15.99</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Método de Pago</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Tarjeta de Crédito/Débito</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-600 rounded"></div>
                          <span>PayPal</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Fecha de Vencimiento *</Label>
                          <Input 
                            id="expiry" 
                            placeholder="MM/YY" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input 
                            id="cvv" 
                            placeholder="123" 
                            required 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
                        <Input 
                          id="cardName" 
                          placeholder="Juan Pérez" 
                          required 
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img 
                          src={item.image || '/placeholder.svg'} 
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">S/.{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>S/.{summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>{shippingCost === 0 ? 'Gratis' : `S/.${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Impuestos (8%)</span>
                      <span>S/.{tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>S/.{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Pago Seguro</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Tus datos están protegidos con encriptación SSL de 256 bits
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={processing}
                  >
                    {processing ? 'Procesando...' : 'Confirmar Pedido'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
