import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Minus, Plus, X, ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cartService } from "@/services/api";
import Swal from "sweetalert2";
import {
  getLocalCart,
  addToLocalCart,
  removeFromLocalCart,
  setLocalCart,
  clearLocalCart,
} from "@/utils/cartLocal";

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  stock: number;
  size?: string;
  color?: string;
  image?: string;
}

interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary>({
    subtotal: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Cargar carrito local
      const localCart = getLocalCart();
      setCartItems(
        localCart.map((item) => ({
          id: item.productId,
          product_id: item.productId,
          product_name: "", // Puedes cargar el nombre si lo necesitas
          price: 0, // Puedes cargar el precio si lo necesitas
          quantity: item.quantity,
          stock: 99,
          image: "",
        }))
      );
      setSummary({
        subtotal: 0,
        shipping: 0,
        total: 0,
        itemCount: localCart.reduce((sum, item) => sum + item.quantity, 0),
      });
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error("Error loading cart:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const cartData = await cartService.getCart();
      setCartItemCount(cartData.summary?.itemCount || 0);
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setUpdatingItem(itemId);
      if (newQuantity === 0) {
        await cartService.removeFromCart(itemId);
        setCartItems(cartItems.filter((item) => item.id !== itemId));
        toast({
          title: "Producto eliminado",
          description: "El producto se ha eliminado del carrito",
          variant: "success",
        });
      } else {
        await cartService.updateCartItem(itemId, newQuantity);
        setCartItems(
          cartItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity: Math.min(newQuantity, item.stock) }
              : item
          )
        );
        toast({
          title: "Cantidad actualizada",
          description: "La cantidad se ha actualizado correctamente",
          variant: "success",
        });
      }
      loadCart(); // Recargar para obtener totales actualizados
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el carrito",
        variant: "destructive",
      });
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartService.removeFromCart(itemId);
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      loadCart(); // Recargar para obtener totales actualizados
      await loadCartCount(); // Refresca el contador del carrito
      toast({
        title: "¡Eliminado!",
        description: "Producto eliminado del carrito",
        variant: "success",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      });
    }
  };

  // Si NO está autenticado, permitir modificar el carrito local
  const updateLocalQuantity = (
    productId: number,
    newQuantity: number,
    size?: string
  ) => {
    if (newQuantity <= 0) {
      removeFromLocalCart(productId, size);
    } else {
      const cart = getLocalCart();
      const idx = cart.findIndex(
        (item) => item.productId === productId && item.size === size
      );
      if (idx !== -1) {
        cart[idx].quantity = newQuantity;
        setLocalCart(cart);
      }
    }
    // Refrescar vista
    const localCart = getLocalCart();
    setCartItems(
      localCart.map((item) => ({
        id: item.productId,
        product_id: item.productId,
        product_name: "",
        price: 0,
        quantity: item.quantity,
        stock: 99,
        image: "",
      }))
    );
    setSummary({
      subtotal: 0,
      shipping: 0,
      total: 0,
      itemCount: localCart.reduce((sum, item) => sum + item.quantity, 0),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6 animate-pulse" />
            <p>Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito (visitante)
            </h1>
            <p className="text-gray-600 mb-8">
              Puedes agregar productos y se guardarán en tu dispositivo. Inicia
              sesión para comprar.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Iniciar Sesión para Comprar
            </Button>
            <div className="mt-8">
              {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b py-2"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.product_name || "Producto"}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 8,
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                      <span>ID: {item.product_id}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateLocalQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            updateLocalQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateLocalQuantity(item.id, 0)}
                        >
                          Eliminar
                        </Button>
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.size && <p>Talla: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6 animate-pulse" />
            <p>Cargando carrito...</p>
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
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 mb-8">
              ¡Agrega algunos productos increíbles para tu mascota!
            </p>
            <Button
              onClick={() => navigate("/catalog")}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Continuar Comprando
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carrito de Compras
          </h1>
          <p className="text-gray-600">
            {cartItems.length} productos en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Stock disponible: {item.stock}
                      </p>
                      {/* --- Especificaciones --- */}
                      {item.size && (
                        <p className="text-sm text-gray-500">
                          Talla: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-500">
                          Colors: {item.color}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={
                          item.quantity <= 1 || updatingItem === item.id
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            parseInt(e.target.value, 10) || 1
                          )
                        }
                        className="w-16 text-center"
                        min={1}
                        max={item.stock}
                        disabled={updatingItem === item.id}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={
                          item.quantity >= item.stock ||
                          updatingItem === item.id
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        S/.{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        S/.{item.price.toFixed(2)} c/u
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={updatingItem === item.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button variant="outline" onClick={() => navigate("/catalog")}>
                ← Continuar Comprando
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>S/.{summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {summary.shipping === 0
                      ? "Gratis"
                      : `S/.${summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                {summary.shipping === 0 && (
                  <p className="text-sm text-green-600">
                    ¡Envío gratis por compra superior a S/.50!
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>S/.{summary.total.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                  onClick={() => navigate("/checkout")}
                >
                  Proceder al Pago
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Envío Seguro
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Envío gratis en compras +S/.50</li>
                    <li>• Entrega en 2-5 días hábiles</li>
                    <li>• Empaque especializado para mascotas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
