import { Link, useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import {
  MdDashboard,
  MdInventory,
  MdShoppingCart,
  MdCategory,
  MdMessage,
  MdPeople,
} from "react-icons/md";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: MdDashboard },
    { path: "/dashboard/products", label: "Products", icon: MdInventory },
    { path: "/dashboard/orders", label: "Orders", icon: MdShoppingCart },
    { path: "/dashboard/categories", label: "Categories", icon: MdCategory },
    { path: "/dashboard/messages", label: "Messages", icon: MdMessage },
    { path: "/dashboard/users", label: "Users", icon: MdPeople },
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 text-white h-screen sticky top-0">
        <div className="p-4 sm:p-6">
          <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                        isActiveLink(item.path)
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={toggleSidebar}
                    className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      isActiveLink(item.path)
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
