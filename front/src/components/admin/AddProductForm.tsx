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
  colors: string[];
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
    colors: [] as string[],
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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const colorArray = value
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      colors: colorArray,
    }));
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.price.trim() !== "" &&
    !isNaN(Number(formData.price)) &&
    formData.stock >= 0 &&
    formData.petType.trim() !== "" &&
    (imageFile || imageUrl.trim() !== "");

  const handleSubmit = async () => {
    if (!isFormValid) {
      Swal.fire(
        "Error",
        "Completa todos los campos obligatorios y selecciona una imagen.",
        "error"
      );
      return;
    }
    const images = imageFile
      ? [URL.createObjectURL(imageFile)]
      : imageUrl
      ? [imageUrl]
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
      colors: formData.colors,
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
            <div>
              <Label htmlFor="colors">Colores disponibles</Label>
              <Input
                id="colors"
                type="text"
                placeholder="Ej. rojo, azul, negro"
                onChange={handleColorChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ingresa los colores separados por comas.
              </p>
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
            <div className="flex gap-2 items-center mb-2">
              <label>
                <input
                  type="radio"
                  checked={!useUrlInput}
                  onChange={() => setUseUrlInput(false)}
                />{" "}
                Archivo
              </label>
              <label>
                <input
                  type="radio"
                  checked={useUrlInput}
                  onChange={() => setUseUrlInput(true)}
                />{" "}
                URL
              </label>
            </div>
            {!useUrlInput ? (
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            ) : (
              <Input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={handleImageUrlChange}
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
