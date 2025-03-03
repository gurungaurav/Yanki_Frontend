import { useEffect, useState } from "react";
import { getUserDetailById } from "../../api/user.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../../store/useUserStore";
import Button from "../../components/button";

export default function ProfileDetails() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const loggedUser = useUserStore((state) => state.user);

  const fetchUserDetails = async () => {
    if (!loggedUser) {
      toast.error("You need to login to view your profile details");
      navigate("/login");
      return;
    }
    try {
      const data = await getUserDetailById(loggedUser.token);
      setUser(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
      navigate("/login");
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [loggedUser]);

  return (
    <div className="w-full max-w-2xl container mx-auto my-20 border border-gray-200 rounded-md p-6 shadow-md ">
      <div>
        <div>Profile Information</div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">First Name:</p>
            <p>{user.firstName}</p>
          </div>
          <div>
            <p className="font-semibold">Last Name:</p>
            <p>{user.lastName}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>
        <div>
          <p className="font-semibold">Username:</p>
          <p>{user.username}</p>
        </div>
        <div>
          <p className="font-semibold">Phone Number:</p>
          <p>{user.phoneNumber}</p>
        </div>
        <div>
          <p className="font-semibold">Address:</p>
          <p>{user.address}</p>
        </div>
      </div>
      <div className="pt-4 space-x-4">
        <Button
          handleOnClick={() => navigate("/profile/edit-profile")}
          buttonName={"Update Profile"}
        ></Button>
        <Button
          handleOnClick={() => navigate("/profile/edit-password")}
          buttonName={"Update Password"}
        ></Button>
      </div>
    </div>
  );
}
