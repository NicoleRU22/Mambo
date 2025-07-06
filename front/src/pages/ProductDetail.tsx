import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { cartService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { addToLocalCart, getLocalCart } from "@/utils/cartLocal";

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
  pet_type: string;
  stock: number;
}

const ProductDetail = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(state?.product || null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!state?.product) {
      console.warn("Producto no recibido, accediste directamente a /product/:id sin pasar datos.");
      // Si lo deseas, puedes agregar aquí una llamada para buscar el producto por ID desde la API.
    }
  }, [state]);

  const handleAddToCart = async () => {
    if (!product) return;

    let selectedSize = "";
    if (product.sizes.length > 0) {
      const sizeOptions = product.sizes.reduce((acc, size) => {
        acc[size] = size;
        return acc;
      }, {} as Record<string, string>);

      const { value } = await Swal.fire({
        title: "Selecciona una talla",
        html: `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <p style="font-size: 14px; color: #4B5563;">Selecciona una talla disponible para este producto.</p>
            <select id="tallaSelect" class="swal2-input" style="width: 100%; padding: 0.5rem; font-size: 14px;">
              <option value="">Elige una talla</option>
              ${Object.keys(sizeOptions)
                .map((key) => `<option value="${key}">${sizeOptions[key]}</option>`)
                .join("")}
            </select>
            <img src="/guia-tallas.png" alt="Guía de tallas"
              style="width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);" />
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Agregar al carrito",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#8b5cf6",
        customClass: {
          popup: "swal-wide rounded-xl max-w-[90vw] sm:max-w-md",
        },
        preConfirm: () => {
          const select = document.getElementById("tallaSelect") as HTMLSelectElement;
          if (!select.value) {
            Swal.showValidationMessage("Debes seleccionar una talla");
            return;
          }
          return select.value;
        },
      });

      if (!value) return;
      selectedSize = value;
    }

    try {
      if (!user) {
        addToLocalCart(product.id, 1, selectedSize);
        Swal.fire("Agregado", "Producto añadido al carrito local", "success");
        return;
      }

      await cartService.addToCart(product.id, 1);
      Swal.fire("¡Éxito!", "Producto agregado al carrito", "success");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      Swal.fire("Error", "No se pudo agregar al carrito", "error");
    }
  };

  if (!product) {
    return <p className="text-center mt-10">Producto no encontrado. Vuelve al catálogo.</p>;
  }

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

            {product.sizes.length > 0 && (
              <p className="mb-2 text-sm text-gray-600">
                Tallas disponibles: {product.sizes.join(", ")}
              </p>
            )}

            <p className="mb-2 text-sm text-gray-600">Tipo de mascota: {product.pet_type}</p>
            <p className="mb-4 text-sm text-gray-600">Stock disponible: {product.stock}</p>

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate("/catalog")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>

              <Button className="bg-primary-600 hover:bg-primary-700" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
