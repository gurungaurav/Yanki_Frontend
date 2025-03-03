import { useEffect, useState } from "react";
import { Check, CreditCard, Truck } from "lucide-react";
import {
  cancelOrder,
  getSpecificOrder,
  placeOrder,
  verifyOrder,
} from "../../api/order.api";
import useUserStore from "../../store/useUserStore";
import { toast } from "react-toastify";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "../../components/badge";
import Button from "../../components/button";

export default function OrderDetailsPage() {
  const loggedUser = useUserStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");
  const purchase_order_id = searchParams.get("purchase_order_id");
  const [orderDetails, setOrderDetails] = useState(null); // Initially null to handle order not found state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // To handle errors
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    verifyPayment();
  }, [pidx, purchase_order_id, loggedUser?.token]);

  useEffect(() => {
    if (purchase_order_id) {
      fetchOrderDetails();
    } else {
      setError("Invalid order ID.");
      setLoading(false);
    }
  }, [purchase_order_id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await getSpecificOrder(purchase_order_id);
      setOrderDetails(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to fetch order details."
      );
    } finally {
      setLoading(false);
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
    console.log(totalAmount, "totalAmount");

    try {
      const initialValues = {
        purchase_order_id,
        website_url: "http://localhost:5000",
        totalPrice: totalAmount,
      };

      const data = await placeOrder(initialValues, loggedUser.token);
      window.location.href = data.data.payment_url;
      console.log(data.data, "sdsdsds");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error.response?.data?.message);
    }
  };

  const totalAmount =
    orderDetails?.totalAmount || calculateTotalAmount(orderDetails?.items);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-12 w-full">
          <div className="text-center text-red-600 font-semibold">{error}</div>
        </main>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-12 w-full">
          <div className="text-center text-red-600 font-semibold">
            Order not found
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full ">
      <main className="container mx-auto px-4 py-12 w-full">
        <div className="flex gap-8 justify-center">
          <div className="mb-8 bg-white shadow rounded-md p-4  w-xl border border-gray-100">
            <div className="pb-4 border-b mb-4 border-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl font-bold">
                    Order #{orderDetails.orderId}
                  </div>
                  <div className="text-sm text-gray-500">
                    Placed on{" "}
                    {new Date(orderDetails.orderDate).toLocaleString()}
                  </div>
                </div>
                <Badge status={orderDetails.orderStatus} />
              </div>
            </div>
            <div className="pb-4 mb-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">
                    SHIPPING ADDRESS
                  </h3>
                  <div className="text-sm">
                    <p className="font-medium">{orderDetails.username}</p>
                    <p>{orderDetails.address}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">
                    PAYMENT METHOD
                  </h3>
                  <div className="flex items-center gap-2">
                    {orderDetails.paymentMethod === "Khalti" ? (
                      <CreditCard className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {orderDetails.paymentMethod}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">
                    SHIPPING METHOD
                  </h3>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Standard Shipping
                    </span>
                  </div>
                </div>
              </div>
              {orderDetails.orderStatus === "pending" && (
                //either the user can verify the payment or cancel the order
                <p className="text-sm text-gray-500 mt-4">
                  You can either verify the payment to proceed with the order or
                  cancel the order if you no longer wish to continue.
                </p>
              )}
              {orderDetails.orderStatus === "shipped" && (
                <p className="text-sm text-gray-500 mt-4">
                  Your order has been shipped. It will be delivered to you
                  shortly. You can cancel the order if you no longer wish to
                  continue.
                </p>
              )}

              <div className="flex  gap-4 mt-2">
                {orderDetails.orderStatus === "pending" && (
                  <Button
                    buttonName={"Verify Payment"}
                    handleOnClick={processPayment}
                    // handleOnClick={verifyPayment}
                  />
                )}

                {(orderDetails.orderStatus === "shipped" ||
                  orderDetails.orderStatus === "pending") && (
                  <Button
                    buttonName={"Cancel Order"}
                    handleOnClick={() => setShowRefundModal(true)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white shadow rounded-lg p-4 w-2xl border border-gray-100">
            <div className=" border-b pb-4 mb-4 border-gray-300">
              <div className="text-xl font-bold">Order Details</div>
            </div>
            <div className=" mb-4">
              <div className="space-y-6">
                {orderDetails.items.map((item, index) => (
                  <Link
                    to={`/product/${item.productId}`}
                    className="flex items-start gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md duration-300"
                    key={index}
                  >
                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.productName}</h3>
                        <p className="font-medium">NPR {item.price}</p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </Link>
                ))}
                <div className="flex justify-between font-medium border-t pt-4 mb-4 border-gray-300">
                  <span>Total</span>
                  <span>NPR {totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {showRefundModal && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h3 className="text-lg font-semibold">Refund Order</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to refund this order?
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <Button
                buttonName={"Confirm"}
                handleOnClick={handleCancelOrder}
                // handleOnClick={onConfirm}
              />

              <Button
                buttonName={"Cancel"}
                handleOnClick={() => setShowRefundModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
