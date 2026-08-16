import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { useEffect, useState } from "react";
import { getOrdersAdmin, updateOrderStatus } from "../../../api/order.api";
import useUserStore from "../../../store/useUserStore";
import { Badge } from "../../../components/badge";
import { MdVisibility } from "react-icons/md";

const OrderListsPage = () => {
  const navigate = useNavigate();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const { token } = useUserStore((state) => state.user);

  const filterOrders = async () => {
    const filters = {};
    if (status !== "All") filters.status = status;

    try {
      setLoading(true);
      const data = await getOrdersAdmin(filters);
      setFilteredOrders(data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterOrders();
  }, [status]);

  const updateOrder = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, token);
      filterOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (loading) {
    return (
      <div className="">
        <div className="flex justify-center items-center h-64 md:h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-600">
              Loading orders...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-start mb-4 md:mb-6 ">
        Order Management
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
        <div className="w-full sm:w-auto">
          <label className="block text-sm font-semibold mb-1 md:mb-2 text-gray-700">
            Filter by Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-48 border border-gray-300 px-2 md:px-3 py-2 md:py-3 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Orders</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-600">
              No orders found
            </p>
          </div>
        ) : (
          filteredOrders?.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {order.username}
                  </p>
                </div>
                <Badge status={order.orderStatus} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Date:</span>
                  <p>{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium">Amount:</span>
                  <p className="font-semibold text-gray-900">
                    NPR {order.totalAmount}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Payment:</span>
                  <span className="ml-1">
                    {order.orderStatus === "cancelled"
                      ? "Refunded"
                      : order.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  buttonName="View Details"
                  handleOnClick={() =>
                    navigate(
                      `/dashboard/order-details?purchase_order_id=${order.orderId}`
                    )
                  }
                  className="flex-1 text-xs sm:text-sm"
                />
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrder(order.orderId, e.target.value)}
                  className="flex-1 border border-gray-300 px-2 py-2 rounded text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                Order ID
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8">
                  <p className="text-lg font-semibold text-gray-600">
                    No orders found
                  </p>
                </td>
              </tr>
            ) : (
              filteredOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderId}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.username}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderStatus === "cancelled"
                      ? "Refunded"
                      : order.paymentMethod}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <Badge status={order.orderStatus} />
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    NPR {order.totalAmount}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/order-details?purchase_order_id=${order.orderId}`
                          )
                        }
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                        title="View Order Details"
                      >
                        <MdVisibility className="h-3 w-3" />
                        View
                      </button>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateOrder(order.orderId, e.target.value)
                        }
                        className="border border-gray-300 px-2 py-1 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        title="Update Order Status"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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

export default OrderListsPage;
