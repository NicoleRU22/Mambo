import prisma from "../lib/db.js";

export const blogService = {
  // Obtener todos los posts publicados
  getAllPosts: async () => {
    try {
      const posts = await prisma.blogPost.findMany({
        orderBy: { date: 'desc' }
      });
      return posts;
    } catch (error) {
      throw new Error('Error al obtener posts del blog');
    }
  },

  // Obtener post por ID
  getPostById: async (id) => {
    try {
      const post = await prisma.blogPost.findUnique({
        where: { id: parseInt(id) }
      });
      return post;
    } catch (error) {
      throw new Error('Error al obtener post');
    }
  },

  // Crear nuevo post
  createPost: async (postData) => {
    try {
      const post = await prisma.blogPost.create({
        data: {
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          image: postData.image,
          category: postData.category
        }
      });
      return post;
    } catch (error) {
      throw new Error('Error al crear post');
    }
  },

  // Actualizar post
  updatePost: async (id, postData) => {
    try {
      const post = await prisma.blogPost.update({
        where: { id: parseInt(id) },
        data: {
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          image: postData.image,
          category: postData.category
        }
      });
      return post;
    } catch (error) {
      throw new Error('Error al actualizar post');
    }
  },

  // Eliminar post
  deletePost: async (id) => {
    try {
      await prisma.blogPost.delete({
        where: { id: parseInt(id) }
      });
      return true;
    } catch (error) {
      throw new Error('Error al eliminar post');
    }
  },

  // Obtener posts por categoría
  getPostsByCategory: async (category) => {
    try {
      const posts = await prisma.blogPost.findMany({
        where: { category },
        orderBy: { date: 'desc' }
      });
      return posts;
    } catch (error) {
      throw new Error('Error al obtener posts por categoría');
    }
  }
};

