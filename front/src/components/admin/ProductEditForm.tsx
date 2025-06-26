import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image: string;
}

interface ProductEditFormProps {
  product: Product;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({ product }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product.image);

  const [formData, setFormData] = useState({
    name: product.name,
    description: '',
    price: product.price,
    stock: product.stock.toString(),
    category: product.category,
    ingredients: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="max-w-5xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Editar Producto</CardTitle>
        <p className="text-sm text-gray-500 mt-1">Modifica la información del producto</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="name">Nombre del producto</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={formData.description} onChange={handleChange} placeholder="Describe brevemente el producto" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="text" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="text" value={formData.stock} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" value={formData.category} onChange={handleChange} />
            </div>

            
          </div>

          <div className="space-y-4">
            <Label htmlFor="image">Imagen del producto</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="rounded-lg w-full h-40 object-cover border"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline">Cancelar</Button>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">Actualizar Producto</Button>
        </div>

        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-4">Tipos de mascota recomendados</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <Checkbox id="dog" />
              <span>Perros</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox id="cat" />
              <span>Gatos</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox id="bird" />
              <span>Aves</span>
            </label>
            <label className="flex items-center space-x-2">
              <Checkbox id="fish" />
              <span>Peces</span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};