import axios from "axios";

// NO hagas import de productService aquí, estás en el archivo que lo define

export const productService = {
  getAll: async () => {
    const response = await axios.get("/api/products");
    return response.data;
  },
};
