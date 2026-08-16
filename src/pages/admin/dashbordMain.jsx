import { useEffect, useState } from "react";
import { getOrdersAdmin } from "../../api/order.api";
import { getDashboardData } from "../../api/dashboard.api";
import { Badge } from "../../components/badge";
import {
  MdPeople,
  MdShoppingCart,
  MdInventory,
  MdAttachMoney,
} from "react-icons/md";

export default function DashbordPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const filterOrders = async () => {
    try {
      const data = await getOrdersAdmin();
      setFilteredOrders(data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    filterOrders();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const details = await getDashboardData();
      setTotalUsers(details.data.totalUsers);
      setTotalOrders(details.data.totalOrders);
      setTotalProducts(details.data.totalProducts);
      setTotalRevenue(details.data.totalAmount);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: MdPeople,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: MdShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: MdInventory,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `NPR ${totalRevenue}`,
      icon: MdAttachMoney,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) {
    return (
      <div className=" h-full">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          Dashboard
        </h1>
        <div className="flex justify-center items-center h-64 md:h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-600">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" h-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 md:mb-6 ">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-sm md:text-base font-medium text-gray-600 mb-1 md:mb-2">
                    {stat.title}
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 md:p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white shadow-md rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Recent Orders
          </h2>
        </div>

        {/* Mobile Table View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {filteredOrders?.slice(0, 10).map((order) => (
              <div key={order._id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-sm">#{order?.orderId}</p>
                    <p className="text-sm text-gray-600">{order?.username}</p>
                  </div>
                  <Badge status={order?.orderStatus} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Date:</span>
                    <p>{new Date(order?.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span>
                    <p className="font-semibold text-gray-900">
                      NPR {order?.totalAmount}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Payment:</span>
                    <span className="ml-1">
                      {order?.orderStatus === "cancelled"
                        ? "Refunded"
                        : order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders?.slice(0, 10).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order?.orderId}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order?.username}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order?.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order?.orderStatus === "cancelled"
                      ? "Refunded"
                      : order.paymentMethod}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <Badge status={order?.orderStatus} />
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    NPR {order?.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
