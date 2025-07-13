import React, { useEffect, useState } from "react";
import { categoryService } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const defaultCategoryImages = {
  'Ropa': 'https://e-an.americatv.com.pe/util-e-interesante-recomendable-ponerle-ropa-y-zapatos-perros-n332852-696x418-1071014.jpg',
  'Alimento': 'https://i0.wp.com/cat-oh.com/wp-content/uploads/2021/10/orijen_productos.jpg?fit=570%2C453&ssl=1',
  'Juguetes': 'https://i0.wp.com/puppis.blog/wp-content/uploads/2019/11/Tipos-de-juguetes-para-perros.jpg?resize=900%2C450&ssl=1',
  'Accesorios': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6gTLAfcLq5g70MlzurRFML8Rxn4qRZhQHJw&s',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    categoryService.getAll().then(setCategories);
  }, []);

  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Todas las Categorías</h1>
      <div className="mb-6 max-w-md mx-auto">
        <Input
          placeholder="Buscar categoría..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((category) => (
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
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No se encontraron categorías.</div>
        )}
      </div>
    </div>
  );
};

export default Categories; 