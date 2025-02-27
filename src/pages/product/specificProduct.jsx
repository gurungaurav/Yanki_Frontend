import { Star, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProducts, getSpecificProduct } from "../../api/product.api";
import { getProductReviews } from "../../api/reviews";
import useCartStore from "../../store/useCartStore";
import { toast } from "react-toastify";
import ProductCard from "../../components/productCard";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);

  const getProduct = async () => {
    try {
      const response = await getSpecificProduct(params?.id);
      setProduct(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [params?.id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-2xl font-bold">Loading...</p>
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
              <Star
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
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Key Features:</h2>
            <ul className="list-disc list-inside mb-6">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-700 mb-2">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Specifications:</h2>
            <div className="grid grid-cols-2 gap-4">
              {product.specifications.map((spec, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{spec.name}:</span>{" "}
                  {spec.value}
                </div>
              ))}
            </div>
          </div> */}
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

  const geReview = async () => {
    try {
      const response = await getProductReviews(productId, false);
      setReview(response.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    geReview();
  }, [productId]);

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews?.map((review) => (
          <div key={review?.id} className="border-b pb-4">
            <div className="flex items-center mb-2">
              <span className="font-semibold mr-2">
                {review?.userId?.username}
              </span>
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
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
                {review?.reviewDate}
              </span>
            </div>
            <p className="text-gray-700">{review?.review}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedProducts({ productId, categoryId }) {
  console.log("Related Products", productId, categoryId);

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
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts?.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

function ProductGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0].imageUrl);

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
      <div className="flex items-center border rounded-lg mr-4">
        <button
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-l-lg cursor-pointer"
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
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg cursor-pointer"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>
      <button
        onClick={addToCart}
        className="bg-gray-900 hover:opacity-90 cursor-pointer text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-300"
      >
        <ShoppingCart size={20} className="mr-2" />
        Add to Cart
      </button>
    </div>
  );
}
