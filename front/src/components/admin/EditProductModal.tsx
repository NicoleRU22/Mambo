import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface Category {
  id: number;
  name: string;
}

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
  colors: string[];
  categoryId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductEditModalProps {
  open: boolean;
  product: Product;
  categories: Category[];
  onUpdate: (updatedProduct: Product) => Promise<void>;
  onClose: () => void;
}

export const EditProductModal: React.FC<ProductEditModalProps> = ({
  open,
  product,
  categories,
  onUpdate,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: 0,
    petType: "",
    colors: [] as string[],
    sizes: [] as string[],
    images: [] as string[],
    categoryId: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [isClothingCategory, setIsClothingCategory] = useState(false);

  useEffect(() => {
    if (open && product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || "",
        stock: product.stock,
        petType: product.petType,
        colors: product.colors || [],
        sizes: product.sizes || [],
        images: product.images || [],
        categoryId: product.categoryId?.toString() || "",
        isActive: product.isActive,
      });

      if (product.images?.length > 0) {
        setPreview(product.images[0]);
      }
    }
  }, [open, product]);

  useEffect(() => {
    const selected = categories.find(
      (c) => c.id.toString() === formData.categoryId
    );
    const clothingKeywords = ["ropa", "ropa de temporada"];
    const isClothing = selected
      ? clothingKeywords.includes(selected.name.toLowerCase())
      : false;

    setIsClothingCategory(isClothing);

    // Limpiar si cambia a una categoría que no es ropa
    if (!isClothing) {
      setFormData((prev) => ({ ...prev, sizes: [], colors: [] }));
    }
  }, [formData.categoryId, categories]);

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

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    setPreview(url);
  };

  const handleSubmit = async () => {
    const updatedProduct: Product = {
      ...product,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : undefined,
      stock: formData.stock,
      petType: formData.petType,
      colors: isClothingCategory ? formData.colors : [],
      sizes: isClothingCategory ? formData.sizes : [],
      images: imageFile
        ? [URL.createObjectURL(imageFile)]
        : imageUrl
        ? [imageUrl]
        : formData.images,
      categoryId: formData.categoryId
        ? parseInt(formData.categoryId)
        : undefined,
      isActive: formData.isActive,
      updatedAt: new Date().toISOString(),
    };

    await onUpdate(updatedProduct);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Editar Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="originalPrice">Precio Original</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                />
              </div>

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
                    <SelectValue placeholder="Selecciona tipo de mascota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOG">Perro</SelectItem>
                    <SelectItem value="CAT">Gato</SelectItem>
                    <SelectItem value="RABBIT">Conejo</SelectItem>
                    <SelectItem value="BIRD">Ave</SelectItem>
                    <SelectItem value="FISH">Pez</SelectItem>
                    <SelectItem value="HAMSTER">Hámster</SelectItem>
                    <SelectItem value="TURTLE">Tortuga</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="categoryId">Categoría</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Imagen del producto</Label>
                <div className="flex gap-4 items-center mb-2">
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
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
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

              {isClothingCategory && (
                <>
                  <div className="md:col-span-2">
                    <Label>Colores Disponibles</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[
                        "Negro",
                        "Rojo",
                        "Azul",
                        "Verde",
                        "Blanco",
                        "Gris",
                        "Amarillo",
                      ].map((color) => (
                        <label key={color} className="flex items-center space-x-2">
                          <Checkbox
                            id={color}
                            checked={formData.colors.includes(color)}
                            onCheckedChange={() => handleColorChange(color)}
                          />
                          <span>{color}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Tallas Disponibles</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
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
                </>
              )}

              <div className="flex items-center space-x-2 md:col-span-2">
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

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
