import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface OrderItem {
  id: number
  productName: string
  quantity: number
  productPrice: number
}

interface Props {
  open: boolean
  onClose(): void
  items: OrderItem[]
}

export default function OrderDetailModal({ open, onClose, items }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] sm:w-[500px] max-h-[80vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Detalles del Pedido</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(80vh-64px)] p-4">
          <ul className="space-y-2">
            {items.map(i => (
              <li key={i.id} className="flex justify-between">
                <span>{i.productName} x{i.quantity}</span>
                <span>S/.{i.productPrice.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
