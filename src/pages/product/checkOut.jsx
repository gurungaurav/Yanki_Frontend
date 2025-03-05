import { useEffect, useState } from "react";
import Button from "../../components/button";
import useCartStore from "../../store/useCartStore";
import TextInput from "../../components/textInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getUserDetailById } from "../../api/user.api";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { placeOrder } from "../../api/order.api";

export default function CheckOutPage() {
  const initialCartItems = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart); // Get the clearCart function
  const [paymentMethod, setPaymentMethod] = useState("online");
  const navigate = useNavigate();
  const loggedUser = useUserStore((state) => state.user);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: 0,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      address: Yup.string().required("Address is required"),
      phoneNumber: Yup.string()
        .length(10, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const fetchUserDetails = async () => {
    if (!loggedUser) {
      toast.error("You need to login to order products");
      navigate("/login");
      return;
    }
    try {
      const data = await getUserDetailById(loggedUser.token);
      formik.setFieldValue("firstName", data.data.firstName);
      formik.setFieldValue("lastName", data.data.lastName);
      formik.setFieldValue("phoneNumber", data.data.phoneNumber);
      formik.setFieldValue("address", data.data.address);
    } catch (error) {
      toast.error(error.response?.data?.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [loggedUser]);

  const handleSubmit = async (values) => {
    try {
      const initialValues = {
        userDetails: { ...values },
        orderItems: initialCartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        paymentMethod,
        totalPrice: calculateTotal(),
        website_url: "http://localhost:5000",
      };

      const data = await placeOrder(initialValues, loggedUser.token);
      clearCart();
      if (paymentMethod === "cod") {
        toast.success(data.message);
        navigate(
          `/product/order-details?purchase_order_id=${data.data.orderId}`
        );
        return;
      }
      window.location.href = data.data.payment_url;
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const calculateTotal = () =>
    initialCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8 h-full">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <form
        onSubmit={formik.handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Payment and Input Fields Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="form-radio"
                />
                <span>Online Payment</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="form-radio"
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Input Fields */}
          <div className="bg-white p-6 rounded-md border border-gray-200 shadow">
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            <div className="flex space-x-4">
              <TextInput
                name="firstName"
                label={"First name"}
                placeholder="Enter the first name"
                type="text"
                formik={formik}
              />
              <TextInput
                name="lastName"
                label={"Last name"}
                placeholder="Enter the last name"
                type="text"
                formik={formik}
              />
            </div>
            <TextInput
              name="address"
              label={"Address"}
              placeholder="Enter the address"
              type="text"
              formik={formik}
            />
            <TextInput
              name="phoneNumber"
              label={"Phone number"}
              placeholder="Enter the phone number"
              type="number"
              formik={formik}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className=" p-6 rounded-md h-fit border border-gray-100 shadow">
          <h2 className=" border-b pb-4 mb-4 border-gray-300 font-semibold text-lg">
            Order Summary
          </h2>
          <div className="space-y-2">
            {initialCartItems?.map((item, index) => (
              <Link
                to={`/product/${item.productId}`}
                className="flex items-start gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md duration-300"
                key={index}
              >
                <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="font-medium">NPR {item.price}</p>
                  </div>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-between font-medium border-t mt-4 pt-2 mb-4 border-gray-300">
            <span>Total:</span>
            <span>NPR {calculateTotal()}</span>
          </div>
          <Button
            buttonName={"Place Order"}
            type={"submit"}
            className="w-full mt-4"
          ></Button>
        </div>
      </form>
    </div>
  );
}
