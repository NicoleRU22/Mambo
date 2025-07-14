import { useEffect, useState } from "react";
import { productService } from "../services/productService";

export const useAllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAll().then(setProducts).catch(console.error);
  }, []);

  return { products };
};
