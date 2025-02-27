import { useState } from "react";
import { Trash2 } from "lucide-react";
import useCartStore from "../../store/useCartStore";
import Button from "../../components/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/useUserStore";

export default function CartPage() {
  const initialCartItems = useCartStore((state) => state.cart);
  const removeItems = useCartStore((state) => state.removeFromCart);
  const updateItems = useCartStore((state) => state.updateQuantity);
  const user = useUserStore((state) => state.user);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const naviagte = useNavigate();

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    removeItems(id);
  };

  const decreaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    updateItems(id, cartItems.find((item) => item.id === id).quantity - 1);
  };

  const increaseQuantity = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity < item.availableQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    updateItems(id, cartItems.find((item) => item.id === id).quantity + 1);
  };

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (user) {
      naviagte("/product/check-out");
    } else {
      toast.error("Please login to continue");
      naviagte("/login");
    }
    console.log("Checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4"
              >
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  className="rounded-md w-16 h-16"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    Available Quantity: {item.availableQuantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    NPR {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center border rounded-lg mr-4">
                  <button
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-l-lg cursor-pointer"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    disabled
                    value={item.quantity}
                    className="w-16 px-3 py-2 text-center"
                  />
                  <button
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg cursor-pointer"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="p-2 hover:bg-gray-200 rounded-md duration-300 cursor-pointer"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>NPR {calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between mb-4 text-lg font-bold">
            <span>Total:</span>
            <span>NPR {calculateTotal().toFixed(2)}</span>
          </div>
          <Button
            buttonName={"Place Order"}
            handleOnClick={handleCheckout}
            className="w-full mt-4"
          ></Button>{" "}
        </div>
      </div>
    </div>
  );
}
