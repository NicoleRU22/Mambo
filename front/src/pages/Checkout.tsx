import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Lock,
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cartService, orderService, userService } from "@/services/api";
import Swal from "sweetalert2";

// Declaración de Culqi
declare global {
  interface Window {
    Culqi: any;
  }
}

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

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  });
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isPaying = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCheckoutData();
      loadCulqi();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.culqi = function () {
      if (isPaying.current) {
        if (window.Culqi && window.Culqi.token) {
          // Token recibido, envíalo al backend
          const token = window.Culqi.token.id;
          handleCulqiToken(token);
        } else {
          // El usuario cerró el modal o hubo error
          // Puedes mostrar un error si quieres
        }
        isPaying.current = false;
      }
    };
  }, []);

  const loadCulqi = () => {
    // Cargar Culqi desde CDN
    const script = document.createElement("script");
    script.src = "https://checkout.culqi.com/js/v4";
    script.onload = () => {
      if (window.Culqi) {
        window.Culqi.publicKey =
          import.meta.env.VITE_CULQI_PUBLIC_KEY || "pk_test_51H7X8X8X8X8X8X8X8";
      }
    };
    document.head.appendChild(script);
  };

  const loadCheckoutData = async () => {
    try {
      setLoading(true);

      // Cargar carrito
      const cartData = await cartService.getCart();
      setCartItems(cartData.items || []);
      setSummary(
        cartData.summary || {
          subtotal: 0,
          shipping: 0,
          total: 0,
          itemCount: 0,
        }
      );

      // Cargar perfil del usuario
      const profileData = await userService.getProfile();
      const fullName = profileData.name || user?.name || "";
      const nameParts = fullName.split(" ");

      setShippingForm({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: profileData.email || user?.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zipCode: profileData.zipCode || "",
        notes: "",
      });
    } catch (error) {
      console.error("Error loading checkout data:", error);
      Swal.fire({
        title: "Error",
        text: "Error al cargar los datos del checkout",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateShipping = () => {
    if (shippingMethod === "express") {
      return 15.99;
    }
    return summary.subtotal > 50 ? 0 : 8.99;
  };

  const shippingCost = calculateShipping();
  const tax = summary.subtotal * 0.08; // 8% tax
  const total = summary.subtotal + shippingCost + tax;

  const handleInputChange = (field: keyof ShippingForm, value: string) => {
    setShippingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    for (const field of requiredFields) {
      if (!shippingForm[field as keyof ShippingForm]) {
        Swal.fire({
          title: "Campos requeridos",
          text: `Por favor completa el campo ${field}`,
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
        return false;
      }
    }

    if (!termsAccepted) {
      Swal.fire({
        title: "Términos y condiciones",
        text: "Debes aceptar los términos y condiciones para continuar",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return false;
    }

    return true;
  };

  const handleCulqiToken = async (token) => {
    // Aquí llamas a tu backend para procesar el pago y crear el pedido
    // Por ejemplo, puedes reutilizar tu lógica de checkout:
    try {
      setProcessing(true);
      // Llama a tu backend con el token y los datos del pedido
      // orderService.checkout({ ...datos, payment_token: token });
      // ...
      // Muestra éxito o redirige
    } catch (error) {
      // Maneja el error
    } finally {
      setProcessing(false);
    }
  };

  const handlePay = () => {
    if (!window.Culqi) {
      alert('Culqi no está cargado');
      return;
    }
    isPaying.current = true;
    window.Culqi.settings({
      title: 'Mambo PetShop',
      currency: 'PEN',
      description: 'Pago de pedido',
      amount: Math.round(total * 100),
      // publicKey: import.meta.env.VITE_CULQI_PUBLIC_KEY, // si tu versión lo requiere
    });
    window.Culqi.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      const paymentToken = null;
      // El flujo de Culqi v4 ahora se maneja con handlePay y handleCulqiToken
      // Si el método de pago es contra entrega, puedes manejarlo aquí:
      if (paymentMethod === 'cash') {
        // Aquí puedes llamar directamente a tu backend para crear el pedido sin token
        // orderService.checkout({ ...datos, payment_method: 'cash' });
      }
      // Para tarjeta, el flujo se maneja en handleCulqiToken
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
            <p className="text-gray-600 mb-6">
              Agrega productos antes de proceder al checkout
            </p>
            <Button onClick={() => navigate("/catalog")}>Ir al Catálogo</Button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">
            Completa tus datos para procesar el pedido
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Formulario de envío */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información de contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={shippingForm.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={shippingForm.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingForm.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dirección de envío */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Dirección *</Label>
                  <Input
                    id="address"
                    value={shippingForm.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Calle, número, departamento"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      value={shippingForm.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado/Provincia *</Label>
                    <Input
                      id="state"
                      value={shippingForm.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Código Postal *</Label>
                    <Input
                      id="zipCode"
                      value={shippingForm.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    value={shippingForm.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Instrucciones especiales para la entrega..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Método de envío */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Método de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1">
                      <div className="flex justify-between">
                        <span>Envío estándar</span>
                        <span className="font-semibold">
                          {summary.subtotal > 50 ? "Gratis" : "S/.8.99"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">2-5 días hábiles</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1">
                      <div className="flex justify-between">
                        <span>Envío express</span>
                        <span className="font-semibold">S/.15.99</span>
                      </div>
                      <p className="text-sm text-gray-500">1-2 días hábiles</p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Método de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Tarjeta de crédito/débito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Pago contra entrega</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <ShieldCheck className="h-4 w-4 inline mr-1" />
                      Tus datos de pago están protegidos con encriptación SSL
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Términos y condiciones */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) =>
                      setTermsAccepted(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los{" "}
                    <a
                      href="/terms-and-conditions"
                      className="text-primary-600 hover:underline"
                    >
                      términos y condiciones
                    </a>{" "}
                    y la{" "}
                    <a
                      href="/privacy-policy"
                      className="text-primary-600 hover:underline"
                    >
                      política de privacidad
                    </a>
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Productos */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        S/.{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>S/.{summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span>
                      {shippingCost === 0
                        ? "Gratis"
                        : `S/.${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IGV (8%)</span>
                    <span>S/.{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>S/.{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={handlePay} 
                  disabled={processing}
                >
                  Finalizar Compra
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  Al completar tu compra, aceptas nuestros términos y
                  condiciones
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
