import { useState, useEffect } from "react";
import { getAllProducts } from "../../api/product.api";
import ProductCard from "../../components/productCard";
import { getCategories } from "../../api/category.api";

export default function FilterProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availableCategories, setAvailableCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setAvailableCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log(category);

  useEffect(() => {
    const filterProduct = async () => {
      const filters = { isDeleted: false };

      if (category !== "All") filters.categoryId = category;
      if (search.trim() !== "") filters.search = search.trim();
      if (minPrice || maxPrice) {
        filters.minPrice = minPrice || 0;
        filters.maxPrice = maxPrice || 0;
      }
      console.log(filters);

      try {
        const data = await getAllProducts(filters);
        setFilteredProducts(data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    filterProduct();
  }, [minPrice, maxPrice, search, category]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="md:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Search</h2>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border p-3 text-gray-700"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Category</h2>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              >
                <option value="All">All</option>
                {availableCategories.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Price Range</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min"
                  className="w-full rounded-lg border p-3 text-gray-700"
                />
                <span>to</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max"
                  className="w-full rounded-lg border p-3 text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length ? (
                filteredProducts.map((product) => <ProductCard {...product} />)
              ) : (
                <p>No products found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
