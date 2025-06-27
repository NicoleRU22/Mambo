import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ProductEditForm } from './ProductEditForm';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  image: string;
}

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onUpdate: (updatedProduct: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
  onUpdate,
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] md:max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-4"
      >
        <ProductEditForm product={product} onCancel={onClose} onSave={onUpdate} />
      </DialogContent>
    </Dialog>
  );
};
