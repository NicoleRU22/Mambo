import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Package, Home, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { orderService } from "@/services/api";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(Number(id));
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <p className="text-center text-gray-500">
            Cargando detalles del pedido...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const estimatedDelivery = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Pago Exitoso!
            </h1>
            <p className="text-lg text-gray-600">
              Tu pedido ha sido confirmado y está siendo procesado
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Número de Pedido</p>
                  <p className="font-semibold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Pedido</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Pagado</p>
                  <p className="font-semibold text-primary-600">
                    S/.{order.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Entrega Estimada</p>
                  <p className="font-semibold">{estimatedDelivery}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Tu pedido está siendo preparado
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Recibirás un email con el tracking cuando tu pedido sea
                      enviado
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Productos Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.brand} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      S/.{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/")}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Descargar Recibo
            </Button>
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Ver Mis Pedidos
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              ¿Tienes alguna pregunta sobre tu pedido?
            </p>
            <Button variant="link" className="text-primary-600">
              Contactar Soporte
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
