import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface AddProductFormProps {
  onCancel: () => void;
  onAdd: (
    newProduct: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  categories: Category[];
}

export const AddProductForm: React.FC<AddProductFormProps> = ({
  onCancel,
  onAdd,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: 0,
    petType: "",
    categoryId: "",
    sizes: [] as string[],
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageUrl) {
      setPreview(imageUrl);
    }
  }, [imageFile, imageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "stock" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSizeChange = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setImageFile(null);
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.price.trim() !== "" &&
    !isNaN(Number(formData.price)) &&
    formData.stock >= 0 &&
    formData.petType.trim() !== "";

  const handleSubmit = async () => {
    const images = imageUrl
      ? [imageUrl]
      : imageFile
      ? [URL.createObjectURL(imageFile)]
      : [];

    const newProduct: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      stock: formData.stock,
      petType: formData.petType,
      categoryId: formData.categoryId
        ? parseInt(formData.categoryId)
        : undefined,
      sizes: formData.sizes,
      images,
      isActive: formData.isActive,
    };

    await onAdd(newProduct);
  };

  return (
    <Card className="max-w-5xl mx-auto mt-6 p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Agregar Producto</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Completa la información para registrar un nuevo producto
        </p>
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
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Precio (S/.)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">Precio Original (S/.)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="petType">Tipo de Mascota</Label>
                <Select
                  value={formData.petType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, petType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOG">Perro</SelectItem>
                    <SelectItem value="CAT">Gato</SelectItem>
                    <SelectItem value="BIRD">Ave</SelectItem>
                    <SelectItem value="FISH">Pez</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tallas Disponibles</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <label key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={formData.sizes.includes(size)}
                      onCheckedChange={() => handleSizeChange(size)}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="isActive">Producto Activo</Label>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Imagen del producto</Label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("image/")) {
                  setImageFile(file);
                  setImageUrl("");
                }
              }}
              className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition"
            >
              Arrastra una imagen aquí
            </div>

            <p className="text-center text-gray-500 text-sm">o</p>

            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="uploadFile"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("uploadFile")?.click()}
              >
                Subir desde archivos
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-blue-600"
                onClick={() => setUseUrlInput(!useUrlInput)}
              >
                {useUrlInput
                  ? "Ocultar campo de URL"
                  : "Ingresar URL de imagen"}
              </Button>

              {useUrlInput && (
                <Input
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imageUrl}
                  onChange={handleImageUrlChange}
                />
              )}

              {preview && (
                <img
                  src={preview}
                  alt="Vista previa"
                  className="rounded-md max-w-full max-h-40 object-contain border mt-2 mx-auto"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-10">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            Agregar Producto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
