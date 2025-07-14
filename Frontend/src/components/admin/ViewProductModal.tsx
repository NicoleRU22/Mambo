// src/components/admin/ViewProductModal.tsx

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewProductForm } from "./ViewProductForm";

interface ViewProductModalProps {
  open: boolean;
  onClose: () => void;
  product: any;
}

export const ViewProductModal: React.FC<ViewProductModalProps> = ({
  open,
  onClose,
  product,
}) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[600px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Detalles del Producto</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-64px)] p-4">
          <ViewProductForm product={product} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
