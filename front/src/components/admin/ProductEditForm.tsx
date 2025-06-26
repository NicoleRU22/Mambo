import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductEditFormProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: string;
    stock: number;
    status: string;
    image: string;
  };
  onCancel: () => void;
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({ product, onCancel }) => {
  const [imageSource, setImageSource] = useState<'file' | 'url'>('file');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(product.image);
  const [preview, setPreview] = useState<string>(product.image);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageSource === 'file' && imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageSource === 'url') {
      setPreview(imageUrl);
    }
  }, [imageFile, imageUrl, imageSource]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  return (
    <Card className="max-w-5xl mx-auto mt-10 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Editar Producto</CardTitle>
        <p className="text-sm text-gray-500 mt-1">Modifica la información del producto</p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario izquierdo */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="name">Nombre del producto</Label>
              <Input id="name" defaultValue={product.name} />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Describe brevemente el producto" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  defaultValue={parseFloat(product.price.replace('S/.', '').trim())}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" defaultValue={product.stock} />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Input id="category" defaultValue={product.category} />
            </div>
          </div>

          {/* Imagen producto */}
          <div className="space-y-4">
            <Label className="block">Imagen del producto</Label>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="imageSource"
                  value="file"
                  checked={imageSource === 'file'}
                  onChange={() => setImageSource('file')}
                />
                <span>Archivo</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="imageSource"
                  value="url"
                  checked={imageSource === 'url'}
                  onChange={() => setImageSource('url')}
                />
                <span>URL</span>
              </label>
            </div>

            {imageSource === 'file' && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileUpload"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Seleccionar archivo
                </Button>
              </div>
            )}

            {imageSource === 'url' && (
              <div className="space-y-2">
                <Input
                  ref={urlInputRef}
                  type="text"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
              </div>
            )}

            {/* Vista previa */}
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="rounded-lg w-full h-40 object-cover border"
              />
            )}
          </div>
        </div>

        {/* Tipos de mascota */}
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

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-10">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            Actualizar Producto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
