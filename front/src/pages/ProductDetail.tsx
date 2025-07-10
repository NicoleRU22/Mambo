import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { cartService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { addToLocalCart } from "@/utils/cartLocal";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  images: string[];
  rating: number;
  reviews_count: number;
  sizes: string[];
  pet_type?: string;
  petType?: string; // 👈 incluimos ambas para asegurar compatibilidad
  stock: number;
}

const ProductDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(state?.product || null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!state?.product) {
      console.warn("Producto no recibido, accediste directamente a /product/:id sin pasar datos.");
    } else {
      console.log("Producto recibido:", state.product);
    }
  }, [state]);

  const handleAddToCart = async () => {
    if (product?.sizes.length && !selectedSize) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona una talla",
        text: "Debes elegir una talla antes de agregar el producto al carrito.",
        confirmButtonColor: "#8b5cf6",
        confirmButtonText: "Entendido",
      });
      return;
    }

    try {
      if (!isAuthenticated) {
        addToLocalCart(product.id, 1, selectedSize || undefined);
        Swal.fire({
          icon: "success",
          title: "Agregado al carrito local",
          text: `Producto ${product?.name}${selectedSize ? ` (Talla: ${selectedSize})` : ""} agregado correctamente.`,
          confirmButtonColor: "#8b5cf6",
        });
      } else {
        await cartService.addToCart(product.id, 1, selectedSize || undefined);
        Swal.fire({
          icon: "success",
          title: "Agregado al carrito",
          text: `Producto ${product?.name}${selectedSize ? ` (Talla: ${selectedSize})` : ""} agregado correctamente.`,
          confirmButtonColor: "#8b5cf6",
        });
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto al carrito. Inténtalo de nuevo.",
        confirmButtonColor: "#8b5cf6",
      });
    }
  };

  if (!product) {
    return <p className="text-center mt-10">Producto no encontrado. Vuelve al catálogo.</p>;
  }

  const translatePetType = (type?: string): string => {
  switch (type?.toLowerCase()) {
    case "dog":
      return "Perro";
    case "cat":
      return "Gato";
    case "bird":
      return "Ave";
    case "fish":
      return "Pez";
    case "rabbit":
      return "Conejo";
    case "hamster":
      return "Hámster";
    case "turtle":
      return "Tortuga";
    case "other":
      return "Otro";
    default:
      return "No especificado";
  }
};


  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="rounded-lg w-80 h-auto object-contain mx-auto"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">{product.description}</p>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-semibold text-primary-600">S/. {product.price}</span>
              {product.original_price && (
                <span className="line-through text-gray-400">
                  S/. {product.original_price}
                </span>
              )}
            </div>

            {/* Selección de talla */}
            {product.sizes.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Tallas disponibles:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded px-4 py-1 text-sm ${
                        selectedSize === size
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700"
                      } hover:bg-primary-100 border-primary-600`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowGuide(true)}
                  className="mt-3 text-blue-600 underline text-sm"
                >
                  Ver guía de tallas
                </button>
              </div>
            )}

            <p className="mb-2 text-sm text-gray-600">
  Tipo de mascota: {translatePetType(product.pet_type || product.petType)}
</p>

            <p className="mb-4 text-sm text-gray-600">Stock disponible: {product.stock}</p>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate("/catalog")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>

              <Button
                className="bg-primary-600 hover:bg-primary-700"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal guía de tallas */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Guía de Tallas</h2>
            <img
              src="/guia-tallas.png"
              alt="Guía de Tallas"
              className="w-full max-h-[400px] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
