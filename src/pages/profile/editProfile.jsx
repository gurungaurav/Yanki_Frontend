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
  const { token } = useUserStore((state) => state.user);
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
    phoneNumber: Yup.number().required("Phone number is required"),
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
        console.log(updatedValues, "sdsd");

        const res = await updateUserProfile(token, updatedValues);
        toast.success(res.message);
        console.log(res);
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
      //   navigate("/login");
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  const isFormChanged = () => {
    return (
      formik.values.firstName !== initialValues.firstName ||
      formik.values.lastName !== initialValues.lastName ||
      formik.values.username !== initialValues.username ||
      formik.values.address !== initialValues.address ||
      formik.values.phoneNumber !== initialValues.phoneNumber
    );
  };
  console.log(isFormChanged(), "dsd");

  return (
    <div className="flex items-center justify-center pt-10 pb-10">
      <form
        onSubmit={formik.handleSubmit}
        encType="multipart/form-data"
        className="rounded-md px-10 py-6 flex flex-col gap-2 w-[50%] shadow-md border border-gray-200"
      >
        <div className="flex justify-end">
          <Link
            to={`/profile`}
            className="rounded-full p-2 hover:bg-neutral-100 text-2xl"
          >
            <RxCross1 />
          </Link>
        </div>
        <div className="flex gap-4">
          <TextInput
            label="First Name"
            type="text"
            name="firstName"
            formik={formik}
          />
          <TextInput
            label="Last Name"
            type="text"
            name="lastName"
            formik={formik}
          />
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

        <div className="flex justify-end text-sm font-semibold gap-4 mt-10">
          <Button
            type="submit"
            buttonName={"Update"}
            isDisabled={!isFormChanged()}
          />
        </div>
      </form>
    </div>
  );
}
