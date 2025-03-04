import Hero from "../components/hero";
import { getAllProducts } from "../api/product.api";
import { useEffect, useState } from "react";
import ProductCard from "../components/productCard";
import { getCategories } from "../api/category.api";

export default function Home() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [availableCategories, setAvailableCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories({ isDeleted: false });
      setAvailableCategories(data.data);
      fetchProductsByCategory(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProductsByCategory = async (categories) => {
    const productsByCategory = {};
    for (const category of categories) {
      const data = await getAllProducts({
        limit: 3,
        isDeleted: false,
        categoryId: category._id,
      });
      productsByCategory[category._id] = data.data;
    }
    setProductsByCategory(productsByCategory);
  };

  const fetchProductsByNewArrivals = async () => {
    try {
      const data = await getAllProducts({
        limit: 3,
        isDeleted: false,
      });
      setNewArrivals(data.data);
    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductsByNewArrivals();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50">
        <Hero />
        <section className="pt-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              New Arrivals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newArrivals?.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </div>
        </section>
        {availableCategories.map((category) => (
          <section
            key={category._id}
            id={`category-${category._id}`}
            className="pt-20 bg-white"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productsByCategory[category._id]?.map((product, index) => (
                  <ProductCard key={index} {...product} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
