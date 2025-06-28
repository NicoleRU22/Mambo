import axios from "axios";

export const productService = {
  getAll: async () => {
    const res = await axios.get("/api/products");
    return res.data;
  },
};

export const cartService = {
  addToCart: async (productId, quantity = 1) => {
    const res = await axios.post("/api/cart", {
      productId,
      quantity,
    });
    return res.data;
  },
};

export const categoryService = {
  getAll: async () => {
    const res = await axios.get("/api/categories");
    return res.data;
  },
};
