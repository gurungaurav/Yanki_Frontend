import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../store/useCartStore";
import { toast } from "react-toastify";

export default function ProductCard({
  _id,
  name,
  categoryId,
  description,
  price,
  image,
  hoverImage,
  stockQuantity,
}) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const navigate = useNavigate();
  const addItems = useCartStore((state) => state.addToCart);

  const addToCart = (e) => {
    e.stopPropagation(); // Stop event propagation
    addItems({
      id: _id,
      name,
      price,
      availableQuantity: stockQuantity,
      imageUrl: image,
      quantity: 1,
    });
    toast.success("Product added to cart");
  };

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      // to={`/product/${_id}`}
      className="bg-white rounded-md cursor-pointer shadow border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      <div
        className="relative h-64 w-full cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {/* Main Image */}
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className={`absolute inset-0 object-cover w-full h-full transition-all duration-500 transform ${
            isImageHovered ? "opacity-0 " : "opacity-100 "
          }`}
        />
        {/* Hover Image */}
        <img
          src={hoverImage || "/placeholder.svg"}
          alt={`${name} - alternate view`}
          className={`absolute inset-0 object-cover w-full h-full transition-all duration-500 transform ${
            isImageHovered ? "opacity-100 " : "opacity-0 "
          }`}
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold mb-1">{name}</h3>
            <p className="text-sm text-gray-600">{categoryId?.name}</p>
          </div>
          <span className="text-base font-semibold text-gray-900">
            NPR {price}
          </span>
        </div>
        <p className="text-gray-700 mb-4 h-12 line-clamp-2">{description}</p>
        <button
          onClick={addToCart}
          className="w-full bg-gray-900 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 transform  cursor-pointer"
        >
          <ShoppingCart size={20} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
