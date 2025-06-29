import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

export const productService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/products`);
    return res.data;
  },
};

export const cartService = {
  addToCart: async (productId, quantity = 1) => {
    const res = await axios.post(`${API_URL}/cart`, {
      productId,
      quantity,
    });
    return res.data;
  },
};

export const categoryService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/categories`);
    return res.data;
  },
};

export const userService = {
  getUserStats: async () => {
    const res = await axios.get(`${API_URL}/stats/summary`);
    return res.data;
  },
};
