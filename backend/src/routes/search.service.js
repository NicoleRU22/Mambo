import prisma from "../lib/db.js";

export const searchService = {
  // Buscar productos
  searchProducts: async (searchTerm, userId = null) => {
    try {
      // Registrar la búsqueda si hay un usuario
      if (userId) {
        await prisma.searchLog.create({
          data: {
            term: searchTerm,
            userId: parseInt(userId)
          }
        });
      }

      // Buscar productos que coincidan con el término
      const products = await prisma.product.findMany({
        where: {
          AND: [
            { isActive: true },
            {
              OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { category: { name: { contains: searchTerm, mode: 'insensitive' } } }
              ]
            }
          ]
        },
        include: {
          category: true,
          _count: {
            select: { reviews: true }
          }
        },
        orderBy: { rating: 'desc' }
      });

      return products;
    } catch (error) {
      throw new Error('Error al buscar productos');
    }
  },

  // Buscar productos avanzada con filtros
  advancedSearch: async (params, userId = null) => {
    try {
      const { 
        searchTerm, 
        category, 
        petType, 
        minPrice, 
        maxPrice, 
        minRating,
        sortBy = 'rating',
        sortOrder = 'desc',
        page = 1,
        limit = 20
      } = params;

      // Registrar la búsqueda si hay un usuario
      if (userId && searchTerm) {
        await prisma.searchLog.create({
          data: {
            term: searchTerm,
            userId: parseInt(userId)
          }
        });
      }

      // Construir filtros
      const where = { isActive: true };

      if (searchTerm) {
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } }
        ];
      }

      if (category) {
        where.category = { name: category };
      }

      if (petType) {
        where.petType = petType;
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice);
        if (maxPrice) where.price.lte = parseFloat(maxPrice);
      }

      if (minRating) {
        where.rating = { gte: parseFloat(minRating) };
      }

      // Construir ordenamiento
      const orderBy = {};
      orderBy[sortBy] = sortOrder;

      // Calcular offset para paginación
      const offset = (page - 1) * limit;

      // Ejecutar búsqueda
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            _count: {
              select: { reviews: true }
            }
          },
          orderBy,
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.product.count({ where })
      ]);

      return {
        products,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error('Error en búsqueda avanzada');
    }
  },

  // Obtener términos de búsqueda populares
  getPopularSearchTerms: async (limit = 10) => {
    try {
      const popularTerms = await prisma.searchLog.groupBy({
        by: ['term'],
        _count: {
          term: true
        },
        orderBy: {
          _count: {
            term: 'desc'
          }
        },
        take: limit
      });

      return popularTerms.map(item => ({
        term: item.term,
        count: item._count.term
      }));
    } catch (error) {
      throw new Error('Error al obtener términos populares');
    }
  },

  // Obtener sugerencias de búsqueda
  getSearchSuggestions: async (searchTerm, limit = 5) => {
    try {
      const suggestions = await prisma.product.findMany({
        where: {
          name: { contains: searchTerm, mode: 'insensitive' },
          isActive: true
        },
        select: {
          name: true,
          category: {
            select: { name: true }
          }
        },
        take: limit
      });

      return suggestions.map(item => ({
        name: item.name,
        category: item.category?.name
      }));
    } catch (error) {
      throw new Error('Error al obtener sugerencias');
    }
  },

  // Obtener historial de búsquedas del usuario
  getUserSearchHistory: async (userId, limit = 10) => {
    try {
      const history = await prisma.searchLog.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { searchedAt: 'desc' },
        take: limit,
        distinct: ['term']
      });

      return history.map(item => item.term);
    } catch (error) {
      throw new Error('Error al obtener historial de búsquedas');
    }
  }
};

