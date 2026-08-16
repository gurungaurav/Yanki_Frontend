import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { getUserDetailById, updateUserProfile } from "../../api/user.api";
import TextInput from "../../components/textInput";
import Button from "../../components/button";
import useUserStore from "../../store/useUserStore";
import * as Yup from "yup";

export default function EditProfilePage() {
  const loggedUser = useUserStore((state) => state.user);
  const token = loggedUser?.token;
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    address: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    address: Yup.string().required("Address is required"),
    phoneNumber: Yup.string()
      .length(10, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      address: "",
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedValues = {};
        if (values.firstName !== initialValues.firstName) {
          updatedValues.firstName = values.firstName;
        }
        if (values.lastName !== initialValues.lastName) {
          updatedValues.lastName = values.lastName;
        }
        if (values.username !== initialValues.username) {
          updatedValues.username = values.username;
        }
        if (values.address !== initialValues.address) {
          updatedValues.address = values.address;
        }
        if (values.phoneNumber !== initialValues.phoneNumber) {
          updatedValues.phoneNumber = values.phoneNumber;
        }

        const res = await updateUserProfile(token, updatedValues);
        toast.success(res.message);
        navigate("/profile");
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message);
      }
    },
  });

  const fetchUserDetails = async () => {
    if (!token) {
      toast.error("You need to login to update your profile details");
      navigate("/login");
      return;
    }
    try {
      const data = await getUserDetailById(token);
      const { firstName, lastName, username, address, phoneNumber } = data.data;
      setInitialValues({
        firstName,
        lastName,
        username,
        address,
        phoneNumber,
      });
      formik.setValues({
        firstName,
        lastName,
        username,
        address,
        phoneNumber,
      });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  return (
    <div className="flex items-center justify-center  px-4 py-8 md:py-16">
      <form
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        className="rounded-md px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 flex flex-col gap-3 md:gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl shadow-md border border-gray-200 bg-white"
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            Edit Profile
          </h2>
          <Link
            to={`/profile`}
            className="rounded-full p-2 hover:bg-neutral-100 text-lg sm:text-xl md:text-2xl duration-300"
          >
            <RxCross1 />
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex-1">
            <TextInput
              label="First Name"
              type="text"
              name="firstName"
              formik={formik}
            />
          </div>
          <div className="flex-1">
            <TextInput
              label="Last Name"
              type="text"
              name="lastName"
              formik={formik}
            />
          </div>
        </div>

        <TextInput
          label="Username"
          type="text"
          name="username"
          formik={formik}
        />

        <TextInput label="Address" type="text" name="address" formik={formik} />

        <TextInput
          label="Phone Number"
          type="number"
          name="phoneNumber"
          formik={formik}
        />

        <div className="flex flex-col sm:flex-row justify-end text-sm font-semibold gap-3 md:gap-4 mt-6 md:mt-8">
          <Button
            type="button"
            buttonName="Cancel"
            className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600"
            handleOnClick={() => navigate("/profile")}
          />
          <Button
            type="submit"
            buttonName="Update"
            className="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  );
}
