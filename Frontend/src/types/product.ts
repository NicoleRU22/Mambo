export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    original_price?: number;
    images: string[];
    sizes: string[];
    pet_type: string;
    colors?: string[];
    category?: {
      id: number;
      name: string;
      description?: string;
    };
    stock: number;
  }
  
  export interface Category {
    id: number;
    name: string;
    description?: string;
  }
  