import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../store/useCartStore";

export default function ProductCard({
  _id,
  name,
  categoryId,
  price,
  image,
  hoverImage,
  stockQuantity,
}) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const addItems = useCartStore((state) => state.addToCart);

  const outOfStock = stockQuantity === 0;

  const addToCart = () => {
    addItems({
      id: _id,
      name,
      price,
      availableQuantity: stockQuantity,
      imageUrl: image,
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  return (
    <div className="group relative bg-white">
      <div
        className="relative h-72 w-full overflow-hidden bg-gray-100 sm:h-80"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            isImageHovered && hoverImage ? "opacity-0" : "opacity-100"
          }`}
        />

        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              isImageHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {outOfStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/50">
            <span className="rounded bg-white/95 px-3 py-1.5 text-sm font-semibold text-ink-950">
              Out of stock
            </span>
          </div>
        ) : (
          /*
           * Sits above the stretched card link so it stays clickable, and
           * reveals on keyboard focus as well as hover.
           */
          <button
            type="button"
            onClick={addToCart}
            className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-center gap-2 rounded-lg bg-ink-950 py-3 text-sm font-semibold text-white opacity-0 transition-all duration-300 hover:bg-ink-800 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:translate-y-2"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            Add to cart
          </button>
        )}
      </div>

      <div className="px-1 py-4">
        {categoryId?.name && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            {categoryId.name}
          </p>
        )}

        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 sm:text-base">
          {/* Stretched link: the whole card is clickable, but only one anchor
              exists in the markup. */}
          <Link
            to={`/product/${_id}`}
            className="transition-colors after:absolute after:inset-0 after:z-10 hover:text-gray-600"
          >
            {name}
          </Link>
        </h3>

        <p className="text-lg font-bold text-ink-950">
          NPR {price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
