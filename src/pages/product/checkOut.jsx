import { useEffect, useState } from "react";
import Button from "../../components/button";
import useCartStore from "../../store/useCartStore";
import TextInput from "../../components/textInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getUserDetailById } from "../../api/user.api";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { placeOrder } from "../../api/order.api";

export default function CheckOutPage() {
  const initialCartItems = useCartStore((state) => state.cart);
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
        .max(10, "Phone number must be at least 10 digits")
        .min(10, "Phone number must be at least 10 digits")
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
      console.error("Failed to fetch user details:", error);
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
        totalPrice: calculateTotal(),
        website_url: "http://localhost:5000",
      };

      const data = await placeOrder(initialValues, loggedUser.token);
      window.location.href = data.data.payment_url;
      console.log(data.data, "sdsdsds");
    } catch (error) {
      console.error("Failed to place order:", error);
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
          <div className="bg-white p-6 rounded-lg shadow">
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
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
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
              label={"address"}
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
        <div className="bg-gray-100 p-6 rounded-lg h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {initialCartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <img src={item.image} alt={item.name} className="w-16 h-16" />
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                </div>
                <span>NPR {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total:</span>
            <span>NPR {calculateTotal().toFixed(2)}</span>
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
