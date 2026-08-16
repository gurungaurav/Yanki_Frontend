import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { useEffect, useState } from "react";
import { getAllProducts, softDeleteProduct } from "../../../api/product.api";
import { getCategories } from "../../../api/category.api";
import { MdEdit, MdDelete, MdRestore, MdRateReview } from "react-icons/md";

const ProductListsPage = () => {
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deletedStatus, setDeletedStatus] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setAvailableCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const filterProduct = async () => {
    const filters = {};

    if (category !== "All") filters.categoryId = category;
    if (search.trim() !== "") filters.search = search.trim();
    if (deletedStatus !== "All") {
      if (deletedStatus === "deleted") filters.isDeleted = true;
      if (deletedStatus === "notDeleted") filters.isDeleted = false;
    }

    try {
      const data = await getAllProducts(filters);
      setFilteredProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    filterProduct();
  }, [search, category, deletedStatus]);

  const softDelete = async (productId, isDeleted) => {
    try {
      await softDeleteProduct(productId, isDeleted);
      filterProduct();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-start mb-4 md:mb-6 ">
        Product Management
      </h1>

      {/* Filters and Add Button */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-1">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold mb-1 md:mb-2 text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-300 p-2 md:p-3 text-sm md:text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold mb-1 md:mb-2 text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 px-2 md:px-3 py-2 md:py-3 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {availableCategories.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold mb-1 md:mb-2 text-gray-700">
              Status
            </label>
            <select
              value={deletedStatus}
              onChange={(e) => setDeletedStatus(e.target.value)}
              className="w-full border border-gray-300 px-2 md:px-3 py-2 md:py-3 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Products</option>
              <option value="notDeleted">Active</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>

        <Button
          buttonName={"Add Product"}
          handleOnClick={() => navigate("/dashboard/products/add-product")}
          className="w-full sm:w-auto h-fit"
        />
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredProducts?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-600">
              No products found
            </p>
          </div>
        ) : (
          filteredProducts?.map((product) => (
            <div
              key={product?.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex gap-3 mb-3">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                    {product?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {product?.categoryId.name}
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    NPR {product?.price}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Stock:</span>{" "}
                  {product?.stockQuantity}
                </div>
                <div>
                  <span className="font-medium">Reviews:</span>{" "}
                  {product?.reviewsCount}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
                {product?.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/products/${product?._id}/update-product`
                    )
                  }
                  className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  <MdEdit className="h-3 w-3" />
                  Edit
                </button>

                <button
                  onClick={() =>
                    navigate(`/dashboard/products/${product?._id}/reviews`)
                  }
                  className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                >
                  <MdRateReview className="h-3 w-3" />
                  Reviews
                </button>

                <button
                  onClick={() => softDelete(product._id, !product.isDeleted)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    product?.isDeleted
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {product?.isDeleted ? (
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
                Image
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviews
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts?.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8">
                  <p className="text-lg font-semibold text-gray-600">
                    No products found
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts?.map((product) => (
                <tr key={product?.id} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <img
                      src={product?.image}
                      alt={product?.name}
                      className="h-12 w-12 xl:h-16 xl:w-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                    {product?.name}
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                    {product?.categoryId.name}
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="line-clamp-2">{product?.description}</div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm font-semibold text-gray-900">
                    NPR {product?.price}
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                    {product?.stockQuantity}
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/products/${product?._id}/reviews`)
                      }
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      {product?.reviewsCount} Reviews
                    </button>
                  </td>
                  <td className="px-4 xl:px-6 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/products/${product?._id}/update-product`
                          )
                        }
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit Product"
                      >
                        <MdEdit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() =>
                          softDelete(product._id, !product.isDeleted)
                        }
                        className={`p-1 rounded transition-colors ${
                          product?.isDeleted
                            ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                            : "text-red-600 hover:text-red-900 hover:bg-red-50"
                        }`}
                        title={
                          product?.isDeleted
                            ? "Restore Product"
                            : "Delete Product"
                        }
                      >
                        {product?.isDeleted ? (
                          <MdRestore className="h-4 w-4" />
                        ) : (
                          <MdDelete className="h-4 w-4" />
                        )}
                      </button>
                    </div>
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

export default ProductListsPage;
