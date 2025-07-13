import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { categoryService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const defaultCategoryImages = {
  'Ropa': 'https://e-an.americatv.com.pe/util-e-interesante-recomendable-ponerle-ropa-y-zapatos-perros-n332852-696x418-1071014.jpg',
  'Alimento': 'https://i0.wp.com/cat-oh.com/wp-content/uploads/2021/10/orijen_productos.jpg?fit=570%2C453&ssl=1',
  'Juguetes': 'https://i0.wp.com/puppis.blog/wp-content/uploads/2019/11/Tipos-de-juguetes-para-perros.jpg?resize=900%2C450&ssl=1',
  'Accesorios': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6gTLAfcLq5g70MlzurRFML8Rxn4qRZhQHJw&s',
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getAll().then(setCategories);
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Categorías Populares</h2>
        <p className="text-center text-gray-600 mb-10">
          Encuentra todo lo que necesitas para tu mascota en nuestras categorías especializadas
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
          {categories.slice(0, 4).map((category) => (
            <Card key={category.id} className="relative group overflow-hidden shadow-md">
              <img
                src={category.image || defaultCategoryImages[category.name] || '/placeholder.svg'}
                alt={category.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <CardContent className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 p-4">
                <h3 className="text-white text-lg font-bold mb-1">{category.name}</h3>
                <p className="text-white text-sm">{category._count?.products || '0'}+ productos</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" onClick={() => navigate('/categories')}>
            Ver Todas las Categorías <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
