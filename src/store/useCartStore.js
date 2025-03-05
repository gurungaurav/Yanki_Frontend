import { create } from "zustand";

// Zustand store for cart management
const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [], // Load cart from localStorage
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.id === item.id
      );
      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: Math.min(
                  cartItem.quantity + item.quantity,
                  cartItem.availableQuantity
                ),
              }
            : cartItem
        );
      } else {
        updatedCart = [...state.cart, { ...item }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
      return { cart: updatedCart };
    });
  },
  updateQuantity: (id, quantity) => {
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                Math.max(quantity, 1), // Ensure quantity is at least 1
                item.availableQuantity
              ),
            }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
      return { cart: updatedCart };
    });
  },
  removeFromCart: (id) => {
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Save to localStorage
      return { cart: updatedCart };
    });
  },
  clearCart: () => {
    localStorage.removeItem("cart"); // Remove from localStorage
    set({ cart: [] }); // Clear state
  },
}));

export default useCartStore;
