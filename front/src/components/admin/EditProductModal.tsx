import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-auto">
  <ProductEditForm product={product} onCancel={onClose} />
</DialogContent>

    </Dialog>
  );
};
