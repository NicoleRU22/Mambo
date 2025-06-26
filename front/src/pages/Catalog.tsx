
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Filter, Star, ShoppingCart, Heart } from 'lucide-react';
{/**T */}
import { useNavigate } from "react-router-dom";


const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const products = [
    {
      id: 1,
      name: "Suéter Cozy Winter",
      category: "sweaters",
      price: 24.99,
      originalPrice: 34.99,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviews: 156,
      sizes: ["XS", "S", "M", "L"],
      petType: "dog"
    },
    {
      id: 2,
      name: "Vestido Princesa Rosa",
      category: "dresses",
      price: 32.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      reviews: 89,
      sizes: ["XS", "S", "M"],
      petType: "dog"
    },
    {
      id: 3,
      name: "Camisa Casual Denim",
      category: "shirts",
      price: 19.99,
      originalPrice: 29.99,
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80",
      rating: 4.6,
      reviews: 203,
      sizes: ["S", "M", "L", "XL"],
      petType: "dog"
    },
    {
      id: 4,
      name: "Chaleco Elegante Gato",
      category: "sweaters",
      price: 22.99,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      reviews: 67,
      sizes: ["XS", "S", "M"],
      petType: "cat"
    },
    {
      id: 5,
      name: "Abrigo Impermeable",
      category: "jackets",
      price: 45.99,
      originalPrice: 59.99,
      image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviews: 124,
      sizes: ["S", "M", "L", "XL"],
      petType: "dog"
    },
    {
      id: 6,
      name: "Pijama Cómodo",
      category: "pajamas",
      price: 18.99,
      originalPrice: 25.99,
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
      rating: 4.5,
      reviews: 78,
      sizes: ["XS", "S", "M", "L"],
      petType: "cat"
    }
  ];

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || product.category === selectedCategory)
    );
  });

  {/**T */}
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Ropa</h1>
          <p className="text-gray-600">Encuentra la ropa perfecta para tu mascota</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="sweaters">Suéteres</SelectItem>
                <SelectItem value="dresses">Vestidos</SelectItem>
                <SelectItem value="shirts">Camisas</SelectItem>
                <SelectItem value="jackets">Chaquetas</SelectItem>
                <SelectItem value="pajamas">Pijamas</SelectItem>
              </SelectContent>
            </Select>

            {/* Size Filter */}
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

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="rating">Mejor Valorados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Más filtros</span>
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            //T
            <Card
    key={product.id}
    onClick={() => navigate(`/product/${product.id}`)} // 👈 redirecciona al detalle
    className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
  >
    <div className="relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded-t-lg"
      />
      {product.originalPrice && (
        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          -30%
        </span>
      )}
      <button
       onClick={(e) => {
       e.stopPropagation();
       // Aquí podrías agregar lógica adicional como mostrar un toast o marcar favorito
       console.log("Producto marcado como favorito");
       }}
       className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
       <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
      </button>

    </div>

    <CardContent className="p-4">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

      <div className="flex items-center space-x-1 mb-2">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm text-gray-600">{product.rating}</span>
        <span className="text-sm text-gray-400">({product.reviews})</span>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <span className="text-lg font-bold text-primary-600">S/.{product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through">S/.{product.originalPrice}</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Tallas: {product.sizes.join(', ')}
        </div>
        <Button 
        size="sm" 
        className="bg-primary-600 hover:bg-primary-700"
        onClick={(e) => {
        e.stopPropagation(); 
       // Aquí iría la lógica real para agregar al carrito
        console.log("Producto agregado al carrito desde catálogo");
        }}
        >
        <ShoppingCart className="h-4 w-4 mr-1" />
        Agregar
       </Button>

      </div>
    </CardContent>
  </Card>
))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Cargar más productos
          </Button>
        </div>

        
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
