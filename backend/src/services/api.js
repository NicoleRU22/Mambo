import axios from "axios";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

export const cartService = {
  addToCart: async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 👉 Usuario NO autenticado → guardar en carrito local (guest_cart)
      const localCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");

      const existingItem = localCart.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        localCart.push({ productId, quantity });
      }

      localStorage.setItem("guest_cart", JSON.stringify(localCart));
      return { message: "Producto agregado al carrito (visitante)" };
    }

    // ✅ Usuario autenticado → enviar al backend
    const res = await axios.post(
      `${API_URL}/cart`,
      {
        productId,
        quantity,
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
