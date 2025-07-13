import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AddProductForm } from './AddProductForm';

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

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  categories: Category[];
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ 
  open, 
  onClose, 
  onAdd, 
  categories 
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl w-full p-0 overflow-hidden"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="overflow-y-auto px-6 py-4" style={{ flex: 1 }}>
          <AddProductForm onCancel={onClose} onAdd={onAdd} categories={categories} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
