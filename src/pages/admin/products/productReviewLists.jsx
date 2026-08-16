import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProductReviews,
  softDeleteProductReviews,
} from "../../../api/reviews.api";
import { MdDelete, MdRestore, MdStar, MdArrowBack } from "react-icons/md";

const ProductReviewListsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");

  const filterReviews = async () => {
    try {
      setLoading(true);
      const data = await getProductReviews(productId);
      setReviews(data.data);
      if (data.data.length > 0) {
        setProductName(data.data[0]?.productId?.name || "Unknown Product");
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterReviews();
  }, [productId]);

  const softDelete = async (reviewId) => {
    try {
      await softDeleteProductReviews(reviewId);
      filterReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <MdStar
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="">
        <div className="flex justify-center items-center h-64 md:h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-600">
              Loading reviews...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/dashboard/products")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdArrowBack className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Product Reviews
          </h1>
        </div>
        {productName && (
          <p className="text-sm md:text-base text-gray-600 ml-12">
            Reviews for: <span className="font-medium">{productName}</span>
          </p>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {reviews?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-600">
              No reviews found
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This product hasn't received any reviews yet.
            </p>
          </div>
        ) : (
          reviews?.map((review) => (
            <div
              key={review._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                    {review.userId.username}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({review.rating}/5)
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.isDeleted
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {review.isDeleted ? "Deleted" : "Active"}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {review.review}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => softDelete(review._id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
                    review.isDeleted
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {review.isDeleted ? (
                    <>
                      <MdRestore className="h-3 w-3" />
                      Restore
                    </>
                  ) : (
                    <>
                      <MdDelete className="h-3 w-3" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Review
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <p className="text-lg font-semibold text-gray-600">
                    No reviews found
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This product hasn't received any reviews yet.
                  </p>
                </td>
              </tr>
            ) : (
              reviews?.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {review.userId.username}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm font-medium">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="line-clamp-2">{review.review}</div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.isDeleted
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {review.isDeleted ? "Deleted" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => softDelete(review._id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded transition-colors text-xs ${
                        review.isDeleted
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                      title={
                        review.isDeleted ? "Restore Review" : "Delete Review"
                      }
                    >
                      {review.isDeleted ? (
                        <>
                          <MdRestore className="h-3 w-3" />
                          Restore
                        </>
                      ) : (
                        <>
                          <MdDelete className="h-3 w-3" />
                          Delete
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductReviewListsPage;
