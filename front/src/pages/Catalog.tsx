import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import { Search, Filter, ShoppingCart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { productService, cartService, categoryService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
import { addToLocalCart, getLocalCart } from "@/utils/cartLocal";

// [INTERFACES - sin cambios]
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  images: string[];
  sizes: string[];
  pet_type: string;
  colors?: string[];
  category_name?: string;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const Catalog = () => {
  // [STATES y HOOKS - sin cambios]
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        const mappedProducts = (productsData ?? []).map((p) => ({
          ...p,
          category_name: p.category?.name || "",
        }));
        setProducts(mappedProducts);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCartCount();
    }
  }, [isAuthenticated]);

  const loadCartCount = async () => {
    try {
      const cartData = await cartService.getCart();
      setCartItemCount(cartData.summary?.itemCount || 0);
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || product.category_name === selectedCategory;
    const matchesSize =
      selectedSize === "all" ||
      product.sizes
        .map((s) => s.toLowerCase())
        .includes(selectedSize.toLowerCase());
    return matchesSearch && matchesCategory && matchesSize;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, sortedProducts.length));
  };

  const handleAddToCart = async (
    productId: number,
    quantity: number,
    size: string
  ) => {
    if (!user) {
      addToLocalCart(productId, quantity, size);
      setCartItemCount(
        getLocalCart().reduce((sum, item) => sum + item.quantity, 0)
      );
      return Swal.fire(
        "Agregado",
        "Producto añadido al carrito local",
        "success"
      );
    }

    try {
      setAddingToCart(productId);
      await cartService.addToCart(productId, quantity);
      await loadCartCount();
      Swal.fire("¡Éxito!", "Producto agregado al carrito", "success");
    } catch (error: unknown) {
      console.error("Error al agregar al carrito:", error);
      let msg = "No se pudo agregar al carrito";
      if (typeof error === "object" && error !== null && "message" in error) {
        const message = String((error as { message?: unknown }).message);
        if (message.includes("Stock insuficiente")) msg = "Stock insuficiente";
        if (message.includes("Producto no encontrado"))
          msg = "Producto no disponible";
      }
      Swal.fire("Error", msg, "error");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
    loadCartCount();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Cargando productos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* ...otros elementos omitidos por brevedad... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-lg cursor-pointer"
                onClick={() =>
                  navigate(`/product/${product.id}`, { state: { product } })
                }
              />
              {product.original_price && (
                <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  -
                  {Math.round(
                    ((product.original_price - product.price) /
                      product.original_price) *
                      100
                  )}
                  %
                </span>
              )}
              {/* SOLO botón de vista */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product.id}`, {
                      state: { product },
                    });
                  }}
                  className="p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4 text-gray-600 hover:text-blue-500" />
                </button>
              </div>
            </div>

            <CardContent className="p-4">
              <h3
                className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600"
                onClick={() =>
                  navigate(`/product/${product.id}`, { state: { product } })
                }
              >
                {product.name}
              </h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-primary-600">
                  S/.{product.price}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">
                    S/.{product.original_price}
                  </span>
                )}
              </div>

              {/* ... resto del CardContent sin cambios ... */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ...footer, FloatingCart, etc... */}
      <FloatingCart
        isOpen={isCartOpen}
        onClose={handleCartClose}
        onItemAdded={loadCartCount}
      />
      <Footer />
    </div>
  );
};

export default Catalog;
