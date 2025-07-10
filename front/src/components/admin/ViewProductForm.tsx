// components/ViewProductForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Product {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  petType: string;
  images?: string[];
  sizes?: string[];
  category?: { name: string };
}

interface ViewProductFormProps {
  product: Product;
}

export const ViewProductForm: React.FC<ViewProductFormProps> = ({ product }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <Label>Nombre</Label>
        <Input value={product.name} disabled />
      </div>
      <div>
        <Label>Categoría</Label>
        <Input value={product.category?.name || 'Sin categoría'} disabled />
      </div>
      <div>
        <Label>Precio</Label>
        <Input value={`S/. ${product.price}`} disabled />
      </div>
      <div>
        <Label>Precio Original</Label>
        <Input value={product.originalPrice ? `S/. ${product.originalPrice}` : '—'} disabled />
      </div>
      <div>
        <Label>Stock</Label>
        <Input value={product.stock} disabled />
      </div>
      <div>
        <Label>Tipo de mascota</Label>
        <Input value={product.petType} disabled />
      </div>
      <div className="md:col-span-2">
        <Label>Descripción</Label>
        <Input value={product.description || '—'} disabled />
      </div>
      <div className="md:col-span-2">
        <Label>Tamaños</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {product.sizes?.length ? (
            product.sizes.map((size, idx) => <Badge key={idx}>{size}</Badge>)
          ) : (
            <span>—</span>
          )}
        </div>
      </div>
      <div className="md:col-span-2">
        <Label>Imágenes</Label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.images?.length ? (
            product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Producto"
                className="w-24 h-24 object-cover rounded"
              />
            ))
          ) : (
            <span>Sin imágenes</span>
          )}
        </div>
      </div>
    </div>
  );
};
