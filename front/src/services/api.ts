const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Función para obtener el token del localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Función para hacer requests con headers de autenticación
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  refreshToken: async () => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },
};

// Servicios de productos
export const productService = {
  getAll: async (params?: {
    category?: string;
    pet_type?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;               
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  getById: async (id: number) => {
    return apiRequest(`/products/${id}`);
  },

  getOffers: () => apiRequest('/products/offers'),

  create: async (productData: {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    stock: number;
    petType: string;
    images?: string[];
    sizes?: string[];
    categoryId?: number;
  }) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: number, productData: {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    stock?: number;
    petType?: string;
    images?: string[];
    sizes?: string[];
    categoryId?: number;
  }) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: number) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  getCategories: async () => {
    return apiRequest('/products/categories');
  },

  getCount: async () => {
    return apiRequest('/products/count');
  },
};

// Servicios del carrito
export const cartService = {
  getCart: async () => {
    return apiRequest('/cart');
  },

  addToCart: async (productId: number, quantity: number = 1) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (itemId: number) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },

  checkout: async (checkoutData: {
    shipping_address: string;
    billing_address: string;
    payment_method: string;
    contact_phone: string;
    contact_email: string;
  }) => {
    return apiRequest('/cart/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
  },
};

// Servicios de pedidos
export const orderService = {
  getOrders: async () => {
    return apiRequest('/orders');
  },

  getOrderById: async (id: number) => {
    return apiRequest(`/orders/${id}`);
  },

  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/orders/admin/all${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  getOrderDetails: async (id: number) => {
    return apiRequest(`/orders/admin/${id}`);
  },

  updateOrderStatus: async (id: number, status: string) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  getOrderStats: async () => {
    return apiRequest('/orders/stats/summary');
  },

  checkout: async (checkoutData: {
    shipping_address: string;
    billing_address: string;
    payment_method: string;
    contact_phone: string;
    contact_email: string;
    shipping_method: string;
    notes?: string;
  }) => {
    return apiRequest('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
    });
  },
};

// Servicios de usuarios
export const userService = {
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (profileData: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    address?: string;
  }) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Métodos de administración para usuarios
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/users/admin/all${queryString ? `?${queryString}` : ''}`;
    return apiRequest(endpoint);
  },

  getUserById: async (id: number) => {
    return apiRequest(`/users/admin/${id}`);
  },

  updateUser: async (id: number, userData: {
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  }) => {
    return apiRequest(`/users/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: number) => {
    return apiRequest(`/users/admin/${id}`, {
      method: 'DELETE',
    });
  },

  getUserStats: async () => {
    return apiRequest('/users/stats/summary');
  },
};

// Servicios de categorías
export const categoryService = {
  getAll: async () => {
    return apiRequest('/categories');
  },

  getById: async (id: number) => {
    return apiRequest(`/categories/${id}`);
  },

  getWithProducts: async () => {
    return apiRequest('/categories/with-products');
  },
};

// Health check
export const healthService = {
  check: async () => {
    return apiRequest('/health');
  },
};

// Servicios de blog
export const blogService = {
  getAllPosts: async () => {
    return apiRequest('/blog');
  },

  getPostById: async (id: number) => {
    return apiRequest(`/blog/${id}`);
  },

  createPost: async (postData: {
    title: string;
    excerpt: string;
    content: string;
    image?: string;
    category: string;
  }) => {
    return apiRequest('/blog', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  updatePost: async (id: number, postData: {
    title?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    category?: string;
  }) => {
    return apiRequest(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  deletePost: async (id: number) => {
    return apiRequest(`/blog/${id}`, {
      method: 'DELETE',
    });
  },

  getPostsByCategory: async (category: string) => {
    return apiRequest(`/blog/category/${category}`);
  },
};

// Servicios de newsletter
export const newsletterService = {
  subscribe: async (subscriberData: {
    name: string;
    email: string;
    acceptMarketing?: boolean;
  }) => {
    return apiRequest('/newsletter', {
      method: 'POST',
      body: JSON.stringify(subscriberData),
    });
  },

  unsubscribe: async (email: string) => {
    return apiRequest(`/newsletter/${email}`, {
      method: 'DELETE',
    });
  },

  getAllSubscribers: async () => {
    return apiRequest('/newsletter/subscribers');
  },

  getNewsletterStats: async () => {
    return apiRequest('/newsletter/stats');
  },
};

// Servicios de búsqueda
export const searchService = {
  searchProducts: async (searchTerm: string) => {
    return apiRequest(`/search?q=${encodeURIComponent(searchTerm)}`);
  },

  advancedSearch: async (params: {
    searchTerm?: string;
    category?: string;
    petType?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiRequest(`/search/advanced${queryString ? `?${queryString}` : ''}`);
  },

  getPopularSearchTerms: async (limit: number = 10) => {
    return apiRequest(`/search/popular?limit=${limit}`);
  },

  getSearchSuggestions: async (searchTerm: string, limit: number = 5) => {
    return apiRequest(`/search/suggestions?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
  },

  getUserSearchHistory: async (limit: number = 10) => {
    return apiRequest(`/search/history?limit=${limit}`);
  },
};

// Servicios de ofertas
export const offersService = {
  getAllOffers: async () => {
    return apiRequest('/offers');
  },

  getOfferById: async (id: number) => {
    return apiRequest(`/offers/${id}`);
  },

  getActiveOffers: async () => {
    return apiRequest('/offers/active');
  },

  createOffer: async (offerData: {
    title: string;
    description: string;
    discount: number;
    productId?: number;
    categoryId?: number;
    startDate: string;
    endDate: string;
  }) => {
    return apiRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  },

  updateOffer: async (id: number, offerData: {
    title?: string;
    description?: string;
    discount?: number;
    productId?: number;
    categoryId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    return apiRequest(`/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    });
  },

  deleteOffer: async (id: number) => {
    return apiRequest(`/offers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Servicios de devoluciones
export const returnsService = {
  createReturnRequest: async (returnData: {
    orderId: number;
    reason: string;
    description?: string;
  }) => {
    return apiRequest('/return', {
      method: 'POST',
      body: JSON.stringify(returnData),
    });
  },

  getReturnRequests: async () => {
    return apiRequest('/return');
  },

  getReturnById: async (id: number) => {
    return apiRequest(`/return/${id}`);
  },

  updateReturnStatus: async (id: number, status: string) => {
    return apiRequest(`/return/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  deleteReturnRequest: async (id: number) => {
    return apiRequest(`/return/${id}`, {
      method: 'DELETE',
    });
  },
}; 