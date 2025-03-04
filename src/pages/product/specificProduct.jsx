import { ShoppingCart } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProducts, getSpecificProduct } from "../../api/product.api";
import { addProductReviews, getProductReviews } from "../../api/reviews";
import useCartStore from "../../store/useCartStore";
import { toast } from "react-toastify";
import ProductCard from "../../components/productCard";
import useUserStore from "../../store/useUserStore";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  const getProduct = async () => {
    try {
      const response = await getSpecificProduct(params?.id);
      setProduct(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [params?.id]);

  if (!product) {
    return (
      <div className=" mx-auto px-4 my-44 text-center">
        <p className="text-2xl font-bold">No product found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ProductGallery images={product.images} />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.categoryId.name}</p>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={20}
                className={
                  i < Math.round(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({product.reviewCount} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold text-black mb-6">
            NPR {product.price.toFixed(2)}
          </p>
          <p className="text-sm  mb-4">Quantity: {product.stockQuantity}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <AddToCartSection {...product} />
        </div>
      </div>

      <ReviewSection productId={params?.id} />
      <RelatedProducts
        categoryId={product.categoryId._id}
        productId={product._id}
      />
    </div>
  );
}

function ReviewSection({ productId }) {
  const [reviews, setReview] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const userStore = useUserStore((state) => state?.user);
  const token = userStore?.token;

  const getReview = async () => {
    try {
      const response = await getProductReviews(productId, false);
      setReview(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReview();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token) {
        return toast.error("You need to login to add a review");
      }

      const response = await addProductReviews(
        {
          productId,
          review: reviewText,
          rating,
        },
        token
      );
      toast.success(response.data.message);
      setReviewText("");
      setRating(0);
      getReview(); // Refresh reviews after adding a new one
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="my-20">
      <h2 className="text-2xl font-bold mb-4 pb-4 border-b border-gray-300">
        Customer Reviews
      </h2>
      <div className="space-y-6">
        {reviews?.length === 0 ? (
          <p className="text-gray-700">No reviews yet</p>
        ) : (
          reviews?.map((review) => (
            <div key={review?.id} className="border-b pb-4 border-gray-300">
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">
                  {review?.userId?.username}
                </span>
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={16}
                      className={
                        i < review?.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review?.reviewDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review?.review}</p>
            </div>
          ))
        )}
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4 pb-4 border-b border-gray-300">
        Add Your Review
      </h2>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={24}
                className={`cursor-pointer ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Review
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
            rows="4"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-gray-900 hover:opacity-90 cursor-pointer text-white font-semibold text-sm py-2 px-4 rounded-lg transition duration-300"
        >
          Submit Review
        </button>
      </form>
    </section>
  );
}

function RelatedProducts({ productId, categoryId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  const getRelatedProducts = async () => {
    try {
      const filter = {
        categoryId,
        productId,
      };
      const response = await getAllProducts(filter);
      setRelatedProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRelatedProducts();
  }, [productId]);

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-300">
        Related Products
      </h2>

      {relatedProducts?.length === 0 ? (
        <div className="text-center">
          <p className="text-2xl font-bold mt-10">No related products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts?.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0].imageUrl);

  useEffect(() => {
    setMainImage(images[0].imageUrl);
  }, [images]);

  return (
    <div>
      <div className="mb-4 relative h-96 w-full">
        <img
          src={mainImage || "/placeholder.svg"}
          alt="imag"
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images?.map((image, index) => (
          <div
            key={index}
            className={`relative h-24 cursor-pointer ${
              image === mainImage ? "ring-2 ring-red-600" : ""
            }`}
            onClick={() => setMainImage(image.imageUrl)}
          >
            <img
              src={image.imageUrl || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AddToCartSection({ _id, name, price, stockQuantity, images }) {
  const [quantity, setQuantity] = useState(1);
  //get the addCart function from the store

  const addItems = useCartStore((state) => state.addToCart);
  //Finding the existed item so that if the required quantity of that product is already in the cart then we can't add more than that
  const existedQuantity = useCartStore(
    (state) => state.cart.find((item) => item.id === _id)?.quantity
  );

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    if (existedQuantity) {
      if (quantity + existedQuantity > stockQuantity) {
        console.log("asas");

        return toast(
          `The quantity exceeds the available stock, You can add only ${
            stockQuantity - existedQuantity
          } number of product`
        );
      }
    }
    toast.success("Product added to cart");
    addItems({
      id: _id,
      name,
      price,
      availableQuantity: stockQuantity,
      imageUrl: images[0].imageUrl,
      quantity,
    });
  };

  return (
    <div className="flex items-center mb-6">
      <div className="flex items-center border rounded-md mr-4">
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-l-md cursor-pointer"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <input
          type="number"
          disabled={true}
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
          className="w-16 px-3 py-2 text-center"
        />
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-md cursor-pointer"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>
      <button
        onClick={addToCart}
        className="bg-gray-900 hover:opacity-90 cursor-pointer text-white font-bold py-3 px-6 rounded-md flex items-center justify-center transition duration-300"
      >
        <ShoppingCart size={20} className="mr-2" />
        Add to Cart
      </button>
    </div>
  );
}
