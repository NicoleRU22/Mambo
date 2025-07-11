import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

export const cartService = {
  addToCart: async (productId, quantity = 1, size, color) => {
    const token = localStorage.getItem("token");

    if (!token) {
      const localCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

      const existingItem = localCart.find(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        localCart.push({ productId, quantity, size, color });
      }

      localStorage.setItem("guest_cart", JSON.stringify(localCart));
      return { message: "Producto agregado al carrito (visitante)" };
    }

    // ✅ Enviar al backend los datos completos
    const res = await axios.post(
      `${API_URL}/cart`,
      {
        productId,
        quantity,
        size,
        color,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },
};
