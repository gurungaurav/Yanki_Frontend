import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { useEffect, useState } from "react";
import { getOrdersAdmin, updateOrderStatus } from "../../../api/order.api";
import useUserStore from "../../../store/useUserStore";
import { Badge } from "../../../components/badge";

const OrderListsPage = () => {
  const navigate = useNavigate();

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const { token } = useUserStore((state) => state.user);
  const filterOrders = async () => {
    const filters = {};

    if (status !== "All") filters.status = status;
    console.log(filters);

    try {
      const data = await getOrdersAdmin(filters);
      setFilteredOrders(data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    filterOrders();
  }, [status]);

  const updateOrder = async (orderId, newStatus) => {
    try {
      const data = await updateOrderStatus(orderId, newStatus, token);
      console.log(data);
      filterOrders(); // Refetch the data after updating the order status
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Order Details</h1>
      <div className=" flex justify-between mb-2 items-center">
        <div className="flex gap-4">
          <div>
            <h2 className="text-sm font-semibold mb-2">Status</h2>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border px-2 py-1 rounded w-full"
            >
              <option value="All">All Orders</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
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
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Actions
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
                <td className="border border-gray-300 px-4 py-2 flex gap-2">
                  <Button
                    buttonName={"View"}
                    handleOnClick={() =>
                      navigate(
                        `/dashboard/order-details?purchase_order_id=${order.orderId}`
                      )
                    }
                  />
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateOrder(order.orderId, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListsPage;
