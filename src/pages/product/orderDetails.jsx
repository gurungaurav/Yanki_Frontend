import { useEffect, useState } from "react";
import { ArrowLeft, Check, CreditCard, Truck, X } from "lucide-react";
import {
  cancelOrder,
  getSpecificOrder,
  placeOrder,
  verifyOrder,
} from "../../api/order.api";
import useUserStore from "../../store/useUserStore";
import { toast } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "../../components/badge";
import Button from "../../components/button";

export default function OrderDetailsPage() {
  const loggedUser = useUserStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");
  const purchase_order_id = searchParams.get("purchase_order_id");
  const [orderDetails, setOrderDetails] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verifyPayment();
  }, [pidx, purchase_order_id, loggedUser?.token]);

  useEffect(() => {
    fetchOrderDetails();
  }, [purchase_order_id, loggedUser]);

  const fetchOrderDetails = async () => {
    if (!loggedUser) {
      toast.error("You need to login to view your order details");
      navigate("/login");
      return;
    }
    try {
      const response = await getSpecificOrder(purchase_order_id);
      setOrderDetails(response.data);
    } catch (error) {
      console.log("Failed to fetch order details:", error);
    }
  };

  const verifyPayment = async () => {
    try {
      if (pidx) {
        const response = await verifyOrder(
          { pidx, orderId: purchase_order_id },
          loggedUser.token
        );
        fetchOrderDetails();
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment verification failed."
      );
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await cancelOrder(purchase_order_id, loggedUser.token);
      fetchOrderDetails();
      setShowRefundModal(false);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  const calculateTotalAmount = (items) => {
    return items?.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const processPayment = async () => {
    try {
      const initialValues = {
        purchase_order_id,
        website_url: "http://localhost:5000",
        totalPrice: totalAmount,
      };

      const data = await placeOrder(initialValues, loggedUser.token);
      window.location.href = data.data.payment_url;
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error.response?.data?.message);
    }
  };

  const totalAmount =
    orderDetails?.totalAmount || calculateTotalAmount(orderDetails?.items);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-semibold text-gray-700">
            Order not found
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/product/order-list")}
            className="inline-flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Orders</span>
          </button>
        </div>
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Order Details
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Review your order information and status
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Information Card */}
          <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-200 h-fit">
            {/* Order Header */}
            <div className="pb-4 border-b mb-4 border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Order #{orderDetails.orderId}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(orderDetails.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge status={orderDetails.orderStatus} />
              </div>
            </div>

            {/* Order Information Grid */}
            <div className="pb-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Shipping Address */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <h3 className="font-medium text-xs sm:text-sm text-gray-500 mb-2 uppercase tracking-wide">
                    Shipping Address
                  </h3>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {orderDetails.username}
                    </p>
                    <p className="text-gray-600 mt-1">{orderDetails.address}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="font-medium text-xs sm:text-sm text-gray-500 mb-2 uppercase tracking-wide">
                    Payment
                  </h3>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {orderDetails.orderStatus === "cancelled"
                        ? "Refunded"
                        : orderDetails.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Shipping Method */}
                <div>
                  <h3 className="font-medium text-xs sm:text-sm text-gray-500 mb-2 uppercase tracking-wide">
                    Shipping Method
                  </h3>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      Standard Shipping
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {orderDetails.orderStatus === "pending" && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    You can either verify the payment to proceed with the order
                    or cancel the order if you no longer wish to continue.
                  </p>
                </div>
              )}

              {orderDetails.orderStatus === "shipped" && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    Your order has been shipped. It will be delivered to you
                    shortly. You can cancel the order if needed.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {orderDetails.orderStatus === "pending" && (
                  <Button
                    buttonName="Verify Payment"
                    handleOnClick={processPayment}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  />
                )}

                {(orderDetails.orderStatus === "shipped" ||
                  orderDetails.orderStatus === "pending") && (
                  <Button
                    buttonName="Cancel Order"
                    handleOnClick={() => setShowRefundModal(true)}
                    className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 border border-gray-200">
            {/* Items Header */}
            <div className="border-b pb-4 mb-4 border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Order Items
              </h2>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-4">
              {orderDetails.items.map((item, index) => (
                <Link
                  to={`/product/${item.productId}`}
                  className="flex items-start gap-3 sm:gap-4 cursor-pointer hover:bg-gray-50 p-2 sm:p-3 rounded-md transition-colors duration-200"
                  key={index}
                >
                  <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.productName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate pr-2">
                        {item.productName}
                      </h3>
                      <p className="font-semibold text-sm sm:text-base text-gray-900 whitespace-nowrap">
                        NPR {item.price?.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                      Subtotal: NPR{" "}
                      {(item.price * item.quantity)?.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t pt-4 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Total Amount
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  NPR {totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancel Order
                </h3>
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  buttonName="Cancel Order"
                  handleOnClick={handleCancelOrder}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                />
                <Button
                  buttonName="Keep Order"
                  handleOnClick={() => setShowRefundModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
