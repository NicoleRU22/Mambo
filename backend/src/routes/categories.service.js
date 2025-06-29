import prisma from "../lib/db.js";

export const categoriesService = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true }
          }
        }
      });
      return categories;
    } catch (error) {
      throw new Error('Error al obtener categorías');
    }
  },

  // Obtener categoría por ID
  getCategoryById: async (id) => {
    try {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          products: true,
          _count: {
            select: { products: true }
          }
        }
      });
      return category;
    } catch (error) {
      throw new Error('Error al obtener categoría');
    }
  },

  // Crear nueva categoría
  createCategory: async (categoryData) => {
    try {
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image
        }
      });
      return category;
    } catch (error) {
      throw new Error('Error al crear categoría');
    }
  },

  // Actualizar categoría
  updateCategory: async (id, categoryData) => {
    try {
      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: {
          name: categoryData.name,
          description: categoryData.description,
          image: categoryData.image
        }
      });
      return category;
    } catch (error) {
      throw new Error('Error al actualizar categoría');
    }
  },

  // Eliminar categoría
  deleteCategory: async (id) => {
    try {
      // Verificar si hay productos en la categoría
      const productsCount = await prisma.product.count({
        where: { categoryId: parseInt(id) }
      });

      if (productsCount > 0) {
        throw new Error('No se puede eliminar una categoría que tiene productos');
      }

      await prisma.category.delete({
        where: { id: parseInt(id) }
      });
      return true;
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar categoría');
    }
  },

  // Obtener categorías con productos
  getCategoriesWithProducts: async () => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          products: {
            where: { isActive: true },
            take: 5 // Solo los primeros 5 productos
          },
          _count: {
            select: { products: true }
          }
        }
      });
      return categories;
    } catch (error) {
      throw new Error('Error al obtener categorías con productos');
    }
  }
};

