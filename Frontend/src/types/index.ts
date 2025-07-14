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
  category_name?: string;
  stock: number;
}
