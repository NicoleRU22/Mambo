// Definición del tipo local (ajústalo según tu estructura)
export interface CartItemLocal {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

// Clave usada en localStorage
const LOCAL_CART_KEY = "guest_cart";

export function getLocalCart(): CartItemLocal[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error leyendo el carrito local:", e);
    return [];
  }
}

export function addToLocalCart(
  productId: number,
  quantity: number = 1,
  size?: string,
  color?: string // ✅ AGREGADO
): void {
  const cart = getLocalCart();

  // Buscar si el item ya existe con mismo tamaño y color
  const index = cart.findIndex(
    (item) =>
      item.productId === productId &&
      item.size === size &&
      item.color === color // ✅ NUEVA CONDICIÓN
  );

  if (index !== -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ productId, quantity, size, color }); // ✅ AGREGADO color
  }

  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}


export function removeFromLocalCart(productId: number, size?: string, color?: string): void {
  const cart = getLocalCart().filter(
    (item) => !(item.productId === productId && item.size === size && item.color === color)
  );
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

export function clearLocalCart(): void {
  localStorage.removeItem(LOCAL_CART_KEY);
}

export function setLocalCart(items: CartItemLocal[]): void {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}
