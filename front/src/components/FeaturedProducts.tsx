import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';

import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 7,
      name: 'Alimento Premium para Perros',
      brand: 'Royal Canin',
      price: 45.99,
      originalPrice: 59.99,
      image: 'https://vitalcan.com/wp-content/uploads/2023/04/pack-premium-cordero.png',
      rating: 4.8,
      reviews: 124,
      discount: '23%',
      badge: 'Más Vendido'
    },
    {
      id: 8,
      name: 'Casa para Gatos Moderna',
      brand: 'PetHome',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://petshopdelivery.pe/4375-large_default/550066-rascador-dos-pisos-y-casa-premium-para-gatos-54-x-41-x-70-cm.jpg',
      rating: 4.6,
      reviews: 89,
      discount: '25%',
      badge: 'Nuevo'
    },
    {
      id: 9,
      name: 'Juguete Interactivo para Perros',
      brand: 'FunPet',
      price: 24.99,
      originalPrice: null,
      image: 'https://lleva.pe/media/catalog/product/cache/9ff26ce5d29a3e5c9c029188d8445924/j/u/juguetes-para-perros-5.jpg',
      rating: 4.9,
      reviews: 256,
      discount: null,
      badge: 'Recomendado'
    },
    {
      id: 10,
      name: 'Acuario Completo 40L',
      brand: 'AquaLife',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://acuatica.com.ec/blog/wp-content/uploads/2020/10/peces-acuarios-pequenos.png',
      rating: 4.7,
      reviews: 78,
      discount: '19%',
      badge: 'Oferta'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Los productos más populares y mejor valorados por nuestros clientes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
  
            <Card 
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="group cursor-pointer border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden"
            style={{animationDelay: `${index * 100}ms`}}
             >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badge */}
                  <Badge 
                    className={`absolute top-3 left-3 text-xs font-medium ${
                      product.badge === 'Más Vendido' ? 'bg-secondary-500 text-white' :
                      product.badge === 'Nuevo' ? 'bg-accent-500 text-white' :
                      product.badge === 'Recomendado' ? 'bg-primary-500 text-white' :
                      'bg-red-500 text-white'
                    }`}
                  >
                    {product.badge}
                  </Badge>

                  {/* Discount */}
                  {product.discount && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium">
                      -{product.discount}
                    </Badge>
                  )}

                  {/* Hover buttons */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <Button
                    size="sm"
                    variant="secondary"
                    className="h-10 w-10 p-0"
                    onClick={(e) => {
                    e.stopPropagation();
                      // Aquí iría la lógica para agregar a favoritos
                    console.log("Producto agregado a favoritos");
                      }}
                     >
                     <Heart className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4"
                      onClick={(e) => {
                      e.stopPropagation(); 
                      // Aquí iría tu lógica real para agregar al carrito
                      console.log("Producto agregado al carrito");
                       }}
                        >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                       Agregar
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    <div className="flex">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary-600">
                      S/.{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        S/.{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
          >
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
