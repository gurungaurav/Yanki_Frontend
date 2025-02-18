import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({
  _id,
  name,
  categoryId,
  description,
  price,
  image,
  hoverImage,
  rating,
  reviewsCount,
}) {
  const [isImageHovered, setIsImageHovered] = useState(false);

  return (
    <Link
      to={`/product/${_id}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
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
            <h3 className="text-xl font-semibold mb-1">{name}</h3>
            <p className="text-sm text-gray-600">{categoryId.name}</p>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-700 mb-4 h-12 line-clamp-2">{description}</p>
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < Math.round(rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({reviewsCount} reviews)
          </span>
        </div>
        <button className="w-full bg-black hover:bg-neutral-900 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 transform  cursor-pointer">
          <ShoppingCart size={20} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
