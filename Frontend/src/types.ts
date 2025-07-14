// src/types.ts
export interface OrderItem {
    id: number;
    productName: string;
    productPrice: number;
    quantity: number;
    productImage?: string | null;
  }
  
  export interface Order {
    orderNumber: string;
    createdAt: string;
    totalAmount: number;
    orderItems: OrderItem[];
    // añade aquí cualquier otro campo que recibas del backend
  }
  