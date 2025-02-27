import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-1/4 bg-gray-800 text-white p-4 h-screen">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <ul>
        <li className="mb-4">
          <Link
            to="/dashboard"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-700"
          >
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/dashboard/products"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-700"
          >
            Products
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/dashboard/categories"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-700"
          >
            Categories
          </Link>
        </li>
        {/* Add more links here if needed */}
      </ul>
    </aside>
  );
}
