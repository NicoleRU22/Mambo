import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Swal from "sweetalert2";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  petType: string;
  images: string[];
  sizes: string[];
  colors?: string[];
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface ProductEditFormProps {
  product: Product;
  onCancel: () => void;
  onSave: (updatedProduct: Product) => Promise<void>;
  categories: Category[];
}

export const ProductEditForm: React.FC<ProductEditFormProps> = ({
  product,
  onCancel,
  onSave,
  categories
}) => {
  const [name, setName] = useState<string>(product.name);
  const [description, setDescription] = useState<string>(product.description || '');
  const [price, setPrice] = useState<string>(product.price.toString());
  const [originalPrice, setOriginalPrice] = useState<string>((product.originalPrice || 0).toString());
  const [stock, setStock] = useState<number>(product.stock);
  const [petType, setPetType] = useState<string>(product.petType);
  const [categoryId, setCategoryId] = useState<string>(product.categoryId?.toString() || '');
  const [sizes, setSizes] = useState<string[]>(product.sizes || []);
  const [colors, setColors] = useState<string[]>(product.colors || []); // NUEVO
  const [images, setImages] = useState<string[]>(product.images || []);
  const [isActive, setIsActive] = useState<boolean>(product.isActive);
  const [isClothingCategory, setIsClothingCategory] = useState<boolean>(false); // NUEVO

  const [imageSource, setImageSource] = useState<'file' | 'url'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(images[0] || '');
  const [preview, setPreview] = useState<string>(images[0] || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
  const selected = categories.find((c) => c.id.toString() === categoryId);
  const clothingNames = ['ropa', 'ropa de temporada'];
  setIsClothingCategory(
    selected ? clothingNames.includes(selected.name.toLowerCase()) : false
  );
}, [categoryId, categories]);


  useEffect(() => {
    if (imageSource === 'file' && imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageSource === 'url') {
      setPreview(imageUrl);
    }
  }, [imageFile, imageUrl, imageSource]);

  const isFormValid =
    name.trim() !== '' &&
    price.trim() !== '' &&
    !isNaN(Number(price)) &&
    stock >= 0 &&
    petType.trim() !== '' &&
    (imageFile || imageUrl.trim() !== '' || images.length > 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSizeChange = (size: string) => {
    setSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleColorChange = (color: string) => {
    setColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSave = async () => {
    if (!isFormValid) {
      Swal.fire("Error", "Completa todos los campos obligatorios y selecciona una imagen.", "error");
      return;
    }

    const updatedImages = imageSource === 'file' && imageFile
      ? [URL.createObjectURL(imageFile)]
      : imageSource === 'url' && imageUrl
        ? [imageUrl]
        : images;

    const updatedProduct: Product = {
      ...product,
      name,
      description,
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice) || undefined,
      stock,
      petType,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      sizes,
      colors: isClothingCategory ? colors : [], // NUEVO
      images: updatedImages,
      isActive,
    };

    await onSave(updatedProduct);
  };

  const getStatusBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Sin Stock</Badge>;
    if (stock < 10) return <Badge className="bg-yellow-500">Stock Bajo</Badge>;
    return <Badge className="bg-green-500">Activo</Badge>;
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
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe brevemente el producto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio (S/.)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Precio Original (S/.)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="petType">Tipo de Mascota</Label>
                <Select value={petType} onValueChange={setPetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Perro</SelectItem>
                    <SelectItem value="cat">Gato</SelectItem>
                    <SelectItem value="bird">Ave</SelectItem>
                    <SelectItem value="fish">Pez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isClothingCategory && (
  <div>
    <Label>Tallas Disponibles</Label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
      {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
        <label key={size} className="flex items-center space-x-2">
          <Checkbox
            id={size}
            checked={sizes.includes(size)}
            onCheckedChange={() => handleSizeChange(size)}
          />
          <span>{size}</span>
        </label>
      ))}
    </div>
  </div>
)}


            {isClothingCategory && (
              <div>
                <Label>Colores Disponibles</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {['Rojo', 'Azul', 'Negro', 'Blanco', 'Verde', 'Amarillo'].map((color) => (
                    <label key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={color}
                        checked={colors.includes(color)}
                        onCheckedChange={() => handleColorChange(color)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Estado</Label>
              <div className="mt-1">
                {getStatusBadge(stock)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
              />
              <Label htmlFor="isActive">Producto Activo</Label>
            </div>
          </div>

          {/* Imagen producto */}
          <div className="space-y-4">
            <Label className="block">Imagen del producto</Label>
            <div className="flex gap-2 items-center mb-2">
              <label>
                <input
                  type="radio"
                  checked={imageSource === 'file'}
                  onChange={() => setImageSource('file')}
                /> Archivo
              </label>
              <label>
                <input
                  type="radio"
                  checked={imageSource === 'url'}
                  onChange={() => setImageSource('url')}
                /> URL
              </label>
            </div>

            {imageSource === 'file' ? (
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            ) : (
              <Input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={handleUrlChange}
              />
            )}

            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-2 rounded border w-32 h-32 object-contain"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            Guardar Cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
