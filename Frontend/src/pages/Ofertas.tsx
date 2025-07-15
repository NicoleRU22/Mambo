import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { offersService, cartService } from "@/services/api";
import { Search, Filter, ShoppingCart, Star, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  stock: number;
  category: string;
  pet_type: string;
  image_url?: string;
  rating?: number;
  review_count?: number;
}

const Ofertas = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPetType, setSelectedPetType] = useState("all");
  const [sortBy, setSortBy] = useState("discount");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const offersData = await offersService.getActiveOffers();
        setProducts(offersData || []);
      } catch (error) {
        console.error("Error loading offers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const addToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await cartService.addToCart(productId, 1);
      Swal.fire({
        title: "¡Agregado al carrito!",
        text: "Producto agregado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Error",
        text: "Error al agregar al carrito",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };
  const subscribeToNewsletter = async () => {
    if (!newsletterEmail) {
      Swal.fire({
        title: "Correo requerido",
        text: "Por favor, ingresa tu correo electrónico",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          title: "¡Suscripción exitosa!",
          text: "Gracias por suscribirte al newsletter",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setNewsletterEmail("");
      } else {
        Swal.fire({
          title: result.error === 'Este email ya está suscrito al newsletter' ? "Ya estás suscrito" : "Error",
          text: result.error || "Este correo ya está registrado",
          icon: result.error === 'Este email ya está suscrito al newsletter' ? "info" : "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al suscribirse:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo completar la suscripción",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesPetType =
      selectedPetType === "all" || product.pet_type === selectedPetType;

    return matchesSearch && matchesCategory && matchesPetType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "discount":
        return (b.discount_percentage || 0) - (a.discount_percentage || 0);
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categories = [...new Set(products.map((p) => p.category))];
  const petTypes = [...new Set(products.map((p) => p.pet_type))];

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p>Cargando ofertas...</p>
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
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-8 mb-8 text-white">
          <div className="text-center">
            <Tag className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">¡Ofertas Especiales!</h1>
            <p className="text-xl mb-6">
              Encuentra los mejores descuentos en productos para tu mascota
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Hasta 50% OFF
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Envío Gratis
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
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
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Pet Type Filter */}
              <Select
                value={selectedPetType}
                onValueChange={setSelectedPetType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de mascota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las mascotas</SelectItem>
                  {petTypes.map((petType) => (
                    <SelectItem key={petType} value={petType}>
                      {petType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Mayor descuento</SelectItem>
                  <SelectItem value="price-low">
                    Precio: menor a mayor
                  </SelectItem>
                  <SelectItem value="price-high">
                    Precio: mayor a menor
                  </SelectItem>
                  <SelectItem value="name">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {sortedProducts.length} productos encontrados
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  No se encontraron ofertas con los filtros seleccionados
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedPetType("all");
                  }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount_percentage && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{product.discount_percentage}%
                      </Badge>
                    )}
                    {product.original_price && (
                      <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded text-sm">
                        <span className="line-through text-gray-300">
                          S/.{product.original_price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        S/.{product.price.toFixed(2)}
                      </p>
                      {product.original_price && (
                        <p className="text-sm text-gray-500 line-through">
                          S/.{product.original_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                      <p className="text-xs text-gray-400">
                        {product.pet_type}
                      </p>
                    </div>
                  </div>

                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {product.rating.toFixed(1)} ({product.review_count || 0}
                        )
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>
                    <Button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock === 0}
                      className="bg-primary-600 hover:bg-primary-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product.stock === 0 ? "Sin stock" : "Agregar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                ¡No te pierdas las mejores ofertas!
              </h3>
              <p className="mb-6">
                Suscríbete para recibir ofertas exclusivas y descuentos
                especiales
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Tu email"
                  className="bg-white text-gray-900 border-0 flex-1"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <Button
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={subscribeToNewsletter}
                >
                  Suscribirse
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

export default Ofertas;
