import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: 'Ropa',
      image: 'https://e-an.americatv.com.pe/util-e-interesante-recomendable-ponerle-ropa-y-zapatos-perros-n332852-696x418-1071014.jpg',
      count: '30+ productos',
      color: 'from-primary-500 to-primary-600'
    },
    {
      id: 2,
      name: 'Alimento',
      image: 'https://i0.wp.com/cat-oh.com/wp-content/uploads/2021/10/orijen_productos.jpg?fit=570%2C453&ssl=1',
      count: '20+ productos',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      id: 3,
      name: 'Jueguetes',
      image: 'https://i0.wp.com/puppis.blog/wp-content/uploads/2019/11/Tipos-de-juguetes-para-perros.jpg?resize=900%2C450&ssl=1',
      count: '20+ productos',
      color: 'from-accent-500 to-accent-600'
    },
    {
      id: 4,
      name: 'Accesorios',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6gTLAfcLq5g70MlzurRFML8Rxn4qRZhQHJw&s',
      count: '20+ productos',
      color: 'from-primary-400 to-accent-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Categorías Populares
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para tu mascota en nuestras categorías especializadas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in overflow-hidden"
              style={{animationDelay: `${index * 100}ms`}}
            >
              <CardContent className="p-0 relative">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-60 transition-opacity duration-300`}></div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count}</p>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3"
          >
            Ver Todas las Categorías
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
