import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { getOrdersAdmin } from "../../../api/order.api";
import { getDashboardData } from "../../../api/dashboard.api";
import { Badge } from "../../../components/badge";

export default function DashbordPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

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
      console.log(details.data);

      setTotalUsers(details.data.totalUsers);
      setTotalOrders(details.data.totalOrders);
      setTotalProducts(details.data.totalProducts);
      setTotalRevenue(details.data.totalAmount);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  return (
    <div className="p-4  h-full">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Products</h2>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-2xl font-bold">NPR {totalRevenue}</p>
        </div>
      </div>

      <table className="min-w-full border-collapse border border-gray-300 mt-10">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Order ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Customer Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Payment Method
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Status
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              Total Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders?.map((order) => (
            <tr key={order._id} className="even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {order.orderId}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.username}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(order.orderDate).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order?.orderStatus == "cancelled"
                  ? "Refunded"
                  : order.paymentMethod}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Badge status={order.orderStatus} />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                NPR {order.totalAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
