// src/pages/PaymentSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { orderService } from '@/services/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface OrderItem {
  id: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate      = useNavigate();
  const rawId         = searchParams.get('orderId');
  const orderId       = rawId ? parseInt(rawId, 10) : NaN;

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isNaN(orderId)) {
      navigate('/');
      return;
    }
    orderService.getOrderById(orderId)
      .then(o => setOrder(o))
      .catch(() => navigate('/'));
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-12 text-center">
          <p>Cargando detalles del pedido…</p>
        </main>
        <Footer />
      </div>
    );
  }

  const deliveryDate = new Date(
    Date.now() + 5*24*60*60*1000
  ).toLocaleDateString('es-ES', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto mb-4 h-20 w-20 text-green-500" />
          <h1 className="text-3xl font-bold">¡Pago Exitoso!</h1>
          <p className="mt-2">Tu pedido <strong>#{order.orderNumber}</strong> fue registrado.</p>
        </div>

        <div className="mb-8 space-y-2">
          <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
          <p><strong>Total:</strong> S/.{order.total.toFixed(2)}</p>
          <p><strong>Estado:</strong> {order.status}</p>
          <p><strong>Entrega estimada:</strong> {deliveryDate}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.productName} x{item.quantity}</span>
                <span>S/.{(item.productPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/')}>Volver al Inicio</Button>
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir Recibo
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
