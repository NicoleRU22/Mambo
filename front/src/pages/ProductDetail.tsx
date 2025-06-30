import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";

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

  useEffect(() => {
    if (!state?.product) {
      console.warn("Producto no recibido, accediste directamente a /product/:id sin pasar datos.");
    }
  }, [state]);

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

            <p className="mb-2 text-sm text-gray-600">
              Valoración: ⭐ {product.rating} ({product.reviews_count} opiniones)
            </p>

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


              <Button className="bg-primary-600 hover:bg-primary-700">
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
