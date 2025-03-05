import { Badge } from "../../components/badge";
import { BiCalendar, BiShoppingBag } from "react-icons/bi";
import Button from "../../components/button";
import { useEffect, useState } from "react";
import { getSpecificUserOrders } from "../../api/order.api";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const loggedUser = useUserStore((state) => state.user);
  const jwt = loggedUser?.token;
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!loggedUser) {
      toast.error("You need to login to view your order details");
      navigate("/login");
      return;
    }

    try {
      const response = await getSpecificUserOrders(jwt);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!orders?.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Orders </h1>
        <div className="flex justify-center items-center h-96">
          <h1 className="text-2xl font-bold">No orders found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-4 mb-20">
      <h1 className="text-2xl font-bold mb-6">My Orders </h1>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders?.map((order) => (
          <OrderCard key={order?.id} order={order} />
        ))}
      </div>
    </div>
  );
}

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className=" rounded-md shadow overflow-hidden  bg-white pt-4 pb-8 px-5 m-4 border border-gray-200 w-full flex justify-between">
      <div>
        <div className="font-semibold text-lg mb-1">
          {`Order #${order?.orderId}`} <Badge status={order?.orderStatus} />
        </div>
        <div className="text-gray-500 text-sm font-semibold mb-2 flex gap-3">
          <span className="flex gap-1 items-center">
            <BiCalendar className="text-base" />{" "}
            {new Date(order?.orderDate).toLocaleDateString()}
          </span>
          <span className="flex gap-1 items-center">
            <BiShoppingBag className="text-base" /> {order?.ordersCount} items
          </span>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-xs font-semibold">TOTAL</p>
          <p className="font-semibold">NPR {order?.totalAmount}</p>
        </div>
      </div>
      <div className="flex items-center ">
        <Button
          handleOnClick={() =>
            navigate(
              `/product/order-details?purchase_order_id=${order?.orderId}`
            )
          }
          buttonName={"View "}
        ></Button>
      </div>
    </div>
  );
};
