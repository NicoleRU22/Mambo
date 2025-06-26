import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AddProductForm } from './AddProductForm';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl w-full p-0 overflow-hidden"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="overflow-y-auto px-6 py-4" style={{ flex: 1 }}>
          <AddProductForm onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
