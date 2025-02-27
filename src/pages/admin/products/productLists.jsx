import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { useEffect, useState } from "react";
import { getAllProducts, softDeleteProduct } from "../../../api/product.api";
import { getCategories } from "../../../api/category.api";

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
    console.log(filters);

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
      console.log(productId, isDeleted, "lalalal");

      const data = await softDeleteProduct(productId, isDeleted);
      console.log(data);
      filterProduct(); // Refetch the data after toggling the deleted status
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Product Details</h1>
      <div className=" flex justify-between mb-2 items-center">
        <div className="flex gap-4">
          <div>
            <h2 className="text-sm font-semibold mb-2">Search</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border p-1 text-gray-700"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">Category</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="All">All Products</option>
              {availableCategories.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-2">Deleted Status</h2>
            <select
              value={deletedStatus}
              onChange={(e) => setDeletedStatus(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="All">All Products</option>
              <option value="notDeleted">Not Deleted</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </div>
        <Button
          buttonName={"Add Product"}
          handleOnClick={() => navigate("/dashboard/products/add-product")}
          className="h-fit w-fit"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Image
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Price
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Stock Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Review Count
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Reviews
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Update
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Deleted Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts?.map((product) => (
              <tr key={product.id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  {product.categoryId.name}
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-4 py-1 line-clamp-3 h-[82px] ">
                  {product.description}
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  {product.stockQuantity}
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  {product.reviewsCount}
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  <Button
                    buttonName={"Reviews"}
                    handleOnClick={() =>
                      navigate(`/dashboard/products/${product._id}/reviews`)
                    }
                  ></Button>
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  <Button
                    buttonName={"Update"}
                    handleOnClick={() =>
                      navigate(
                        `/dashboard/products/${product._id}/update-product`
                      )
                    }
                  ></Button>
                </td>
                <td className="border border-gray-300 px-4 py-1">
                  <button
                    onClick={() => softDelete(product._id, !product.isDeleted)}
                    className={`p-2  cursor-pointer opacity-90 rounded-md duration-300 ${
                      product.isDeleted
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {product.isDeleted ? "Restore" : "Delete"}
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

export default ProductListsPage;
