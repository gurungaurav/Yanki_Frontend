import { useEffect } from "react";
import { Check, CreditCard, Truck } from "lucide-react";
import { verifyOrder } from "../../api/order.api";
import useUserStore from "../../store/useUserStore";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function OrderDetailsPage() {
  const loggedUser = useUserStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");
  const purchase_order_id = searchParams.get("purchase_order_id");

  console.log(pidx, purchase_order_id);

  const verifyPayment = async () => {
    try {
      if (pidx) {
        const response = await verifyOrder(
          { pidx, orderId: purchase_order_id },
          loggedUser.token
        );
        console.log(response, "sdsd");

        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error("Failed to verify payment:", error);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [pidx, purchase_order_id, loggedUser.token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12 w-full">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Thank you for your purchase. Your order has been confirmed and will
            be shipped shortly.
          </p>
        </div>
        <div className="flex gap-8   justify-center">
          <div className="mb-8 bg-white shadow rounded-lg p-4 h-fit">
            <div className="pb-4 border-b mb-4 border-b-gray-300">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl font-bold">Order #BS-78291</div>
                  <div className="text-sm text-gray-500">
                    Placed on June 15, 2024 at 2:45 PM
                  </div>
                </div>
                <span className="bg-green-50 text-green-700 border-green-200 inline-block px-2 py-1 text-xs font-semibold rounded-3xl">
                  Confirmed
                </span>
              </div>
            </div>
            <div className="pb-4 mb-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">
                    SHIPPING ADDRESS
                  </h3>
                  <div className="text-sm">
                    <p className="font-medium">John Smith</p>
                    <p>123 Barber Street</p>
                    <p>Apt 4B</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-500 mb-2">
                    PAYMENT METHOD
                  </h3>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Visa ending in 4242
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
                  <p className="text-sm text-gray-500 mt-1">
                    Estimated delivery: June 20-22
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white shadow rounded-lg p-4 w-2xl">
            <div className=" border-b pb-4 mb-4 border-gray-300">
              <div className="text-xl font-bold">Order Details</div>
            </div>
            <div className=" mb-4">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Professional Hair Clippers"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        Professional Hair Clippers
                      </h3>
                      <p className="font-medium">$89.99</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Premium stainless steel with multiple guard sizes
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500">Qty: 1</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Beard Trimming Scissors"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Beard Trimming Scissors</h3>
                      <p className="font-medium">$34.50</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Professional grade stainless steel scissors
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500">Qty: 1</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src="/placeholder.svg?height=80&width=80"
                      alt="Premium Shaving Cream"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Premium Shaving Cream</h3>
                      <p className="font-medium">$24.99</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Sandalwood scent, 8oz bottle
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500">Qty: 2</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between font-medium border-t pt-4 mb-4 border-gray-300">
                  <span>Total</span>
                  <span>$198.09</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
