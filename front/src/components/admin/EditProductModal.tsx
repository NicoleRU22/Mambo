import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ProductEditForm } from './ProductEditForm';

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

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (updatedProduct: Product) => Promise<void>;
  categories: Category[];
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
  onUpdate,
  categories,
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] md:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-4"
      >
        <ProductEditForm 
          product={product} 
          onCancel={onClose} 
          onSave={onUpdate} 
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
};
