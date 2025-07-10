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
import { Search, Filter, ShoppingCart, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { productService, cartService, categoryService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";
import { addToLocalCart, getLocalCart } from "@/utils/cartLocal";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  images: string[];
  sizes: string[];
  pet_type: string;
  category_name?: string;
  stock: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const Catalog = () => {
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

        // Map products to add category_name for filtering
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
      setCartItemCount(getLocalCart().reduce((sum, item) => sum + item.quantity, 0));
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
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const message = String((error as { message?: unknown }).message);
        if (message.includes('Stock insuficiente')) msg = 'Stock insuficiente';
        if (message.includes('Producto no encontrado')) msg = 'Producto no disponible';
      }
      Swal.fire("Error", msg, "error");
    } finally {
      setAddingToCart(null);
    }
  };

  // Cuando se cierra el carrito flotante, refresca el contador
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600">
            Encuentra los mejores productos para tu mascota
          </p>
        </div>

        {/* Búsqueda y botón de filtros */}
        <div className="mb-6 flex flex-col lg:flex-row lg:justify-between gap-4">
          <div className="relative w-full lg:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? "Ocultar filtros" : "Más filtros"}</span>
            </Button>

            {/* Botón del carrito flotante */}
            <Button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-primary-600 hover:bg-primary-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Carrito
              {cartItemCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Filtros adicionales */}
        {showFilters && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Talla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las tallas</SelectItem>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                  <SelectItem value="price-low">
                    Precio: Menor a Mayor
                  </SelectItem>
                  <SelectItem value="price-high">
                    Precio: Mayor a Menor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Contador */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Mostrando {visibleProducts.length} de {sortedProducts.length}{" "}
            productos encontrados
          </p>
        </div>

        {/* Lista de productos */}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Producto marcado como favorito");
                    }}
                    className="p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
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

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {product.sizes.length > 0 &&
                      `Tallas: ${product.sizes.join(", ")}`}
                  </div>
                  <Button
  size="sm"
  className="bg-primary-600 hover:bg-primary-700"
  onClick={async (e) => {
    e.stopPropagation();

    if (product.sizes.length > 0) {
      const sizeOptions = product.sizes.reduce((acc, size) => {
        acc[size] = size;
        return acc;
      }, {} as Record<string, string>);

      const { value: selectedSize } = await Swal.fire({
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
          title: "text-lg font-semibold",
        },
        didOpen: () => {
          // Focus automático en el select
          const selectEl = document.getElementById("tallaSelect") as HTMLSelectElement;
          if (selectEl) selectEl.focus();
        },
        preConfirm: () => {
          const value = (document.getElementById("tallaSelect") as HTMLSelectElement)?.value;
          if (!value) {
            Swal.showValidationMessage("Debes seleccionar una talla");
            return;
          }
          return value;
        },
      });

      if (selectedSize) {
        handleAddToCart(product.id, 1, selectedSize);
      }
    } else {
      handleAddToCart(product.id, 1, "");
    }
  }}
  disabled={addingToCart === product.id}
>
  {addingToCart === product.id ? (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
  ) : (
    <>
      <ShoppingCart className="h-4 w-4 mr-1" />
      Agregar
    </>
  )}
</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botón cargar más */}
        {visibleCount < sortedProducts.length && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={handleLoadMore}>
              Cargar más productos
            </Button>
          </div>
        )}

        {/* No se encontraron productos */}
        {sortedProducts.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </main>

      {/* Carrito flotante */}
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
