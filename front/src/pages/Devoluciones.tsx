import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Package,
  Truck,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Devoluciones = () => {
  const navigate = useNavigate();

  const returnSteps = [
    {
      step: 1,
      title: "Contacta con Soporte",
      description:
        "Comunícate con nuestro equipo de soporte dentro de los 30 días de la compra",
      icon: AlertCircle,
      color: "text-blue-600",
    },
    {
      step: 2,
      title: "Empaca el Producto",
      description:
        "Asegúrate de que el producto esté en su empaque original y en buen estado",
      icon: Package,
      color: "text-orange-600",
    },
    {
      step: 3,
      title: "Envío de Devolución",
      description: "Te proporcionaremos una etiqueta de envío prepagada",
      icon: Truck,
      color: "text-green-600",
    },
    {
      step: 4,
      title: "Reembolso Procesado",
      description:
        "Una vez recibido, procesaremos tu reembolso en 3-5 días hábiles",
      icon: CheckCircle,
      color: "text-purple-600",
    },
  ];

  const returnConditions = [
    {
      title: "Productos Elegibles",
      items: [
        "Productos en su empaque original",
        "Productos sin usar o con uso mínimo",
        "Productos con defectos de fabricación",
        "Productos enviados incorrectamente",
      ],
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Productos No Elegibles",
      items: [
        "Productos personalizados o hechos a medida",
        "Productos de higiene personal",
        "Productos con signos de uso excesivo",
        "Productos sin empaque original",
      ],
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  const faqItems = [
    {
      question: "¿Cuánto tiempo tengo para devolver un producto?",
      answer:
        "Tienes 30 días desde la fecha de compra para solicitar una devolución.",
    },
    {
      question: "¿Quién paga el envío de la devolución?",
      answer:
        "Si la devolución es por defecto del producto o error nuestro, cubrimos el costo del envío. Si es por cambio de opinión, el cliente asume el costo.",
    },
    {
      question: "¿Cuánto tiempo tarda el reembolso?",
      answer:
        "Una vez recibido el producto, procesamos el reembolso en 3-5 días hábiles. El tiempo de acreditación depende de tu banco.",
    },
    {
      question: "¿Puedo cambiar un producto por otro?",
      answer:
        "Sí, puedes solicitar un cambio por otro producto del mismo valor o mayor (pagando la diferencia).",
    },
    {
      question: "¿Qué pasa si el producto llegó dañado?",
      answer:
        "Si el producto llegó dañado, toma fotos y contáctanos inmediatamente. Te enviaremos un reemplazo sin costo adicional.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Devoluciones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu satisfacción es nuestra prioridad. Conoce nuestras políticas de
            devolución y reembolso para que puedas comprar con confianza.
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">30 Días</h3>
                <p className="text-gray-600">Plazo para solicitar devolución</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <RefreshCw className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Reembolso Rápido</h3>
                <p className="text-gray-600">3-5 días hábiles</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Truck className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Envío Gratis</h3>
                <p className="text-gray-600">En devoluciones por defectos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Process Steps */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Proceso de Devolución
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnSteps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className={`h-8 w-8 ${step.color}`} />
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-primary-600 text-white">
                      {step.step}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {returnConditions.map((condition) => (
            <Card key={condition.title}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <condition.icon className={`h-5 w-5 ${condition.color}`} />
                  <span>{condition.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {condition.items.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <condition.icon
                        className={`h-4 w-4 ${condition.color} mt-0.5 flex-shrink-0`}
                      />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Preguntas Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">¿Necesitas Ayuda?</h3>
              <p className="mb-6">
                Nuestro equipo de soporte está disponible para ayudarte con
                cualquier consulta sobre devoluciones
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => navigate("/contact")}
                >
                  Contactar Soporte
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => navigate("/orders")}
                >
                  Ver Mis Pedidos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Devoluciones;
