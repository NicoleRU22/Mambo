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

  create: async (productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    pet_type: string;
    image_url?: string;
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
    stock?: number;
    category?: string;
    pet_type?: string;
    image_url?: string;
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

  getAllOrders: async () => {
    return apiRequest('/orders/admin/all');
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
};

// Health check
export const healthService = {
  check: async () => {
    return apiRequest('/health');
  },
}; 