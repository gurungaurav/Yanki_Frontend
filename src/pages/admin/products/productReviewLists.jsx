import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getProductReviews,
  softDeleteProductReviews,
} from "../../../api/reviews";

const ProductReviewListsPage = () => {
  const { productId } = useParams();

  const [reviews, setReviews] = useState([]);

  const filterReviews = async () => {
    try {
      const data = await getProductReviews(productId);
      setReviews(data.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    filterReviews();
  }, []);

  const softDelete = async (reviewId, isDeleted) => {
    try {
      console.log(reviewId, isDeleted, "lalalal");

      const data = await softDeleteProductReviews(reviewId, isDeleted);
      console.log(data);
      filterReviews(); // Refetch the data after toggling the deleted status
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Product Reviews</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Username
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Rating
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Review
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Review Date
              </th>

              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews?.map((review) => (
              <tr key={review._id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {review.userId.username}
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  {review.rating}
                </td>
                <td className="border border-gray-300 px-4 py-1 line-clamp-3 h-[82px] ">
                  {review.review}
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  {new Date(review.reviewDate).toLocaleDateString()}
                </td>

                <td className="border border-gray-300 px-4 py-1">
                  <button
                    onClick={() => softDelete(review._id, !review.isDeleted)}
                    className={`p-2 cursor-pointer opacity-90 rounded-md duration-300 ${
                      review.isDeleted
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {review.isDeleted ? "Restore" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductReviewListsPage;
