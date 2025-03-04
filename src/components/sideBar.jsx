import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-1/4 bg-gray-900 text-white p-4 h-screen sticky top-0">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <ul>
        <li className="mb-4">
          <Link
            to="/dashboard"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-800 duration-300"
          >
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/dashboard/products"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-800 duration-300"
          >
            Products
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/dashboard/orders"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-800 duration-300"
          >
            Orders
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/dashboard/categories"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-800 duration-300"
          >
            Categories
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/dashboard/messages"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-800 duration-300"
          >
            Messages
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/dashboard/users"
            className="block w-full text-left p-2 rounded-lg hover:bg-gray-800 duration-300"
          >
            Users
          </Link>
        </li>
        {/* Add more links here if needed */}
      </ul>
    </aside>
  );
}
