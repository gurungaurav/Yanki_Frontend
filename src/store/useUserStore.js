import { create } from "zustand";

// Zustand store
const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Load user from localStorage
  setUser: (newUser) => {
    console.log(newUser, "asas");

    localStorage.setItem("user", JSON.stringify(newUser)); // Save to localStorage
    set({ user: newUser }); // Update Zustand state
  },
  updateUser: (updatedFields) => {
    set((state) => {
      const updatedUser = { ...state.user, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated user
      return { user: updatedUser };
    });
  },
  deleteUser: () => {
    localStorage.removeItem("user"); // Remove from localStorage
    set({ user: null }); // Clear state
  },
}));

export default useUserStore;
