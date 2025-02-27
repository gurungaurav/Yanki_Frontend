import { useEffect, useState } from "react";
import Button from "../../../components/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCategories } from "../../../api/category.api";
import TextInput from "../../../components/textInput";
import { addProduct } from "../../../api/product.api";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const [images, setImages] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      description: "",
      quantity: 0,
      categoryId: "",
      images: [],
    },
    validationSchema: Yup.object({
      productName: Yup.string().required("Product name is required"),
      price: Yup.number().required("Price is required"),
      description: Yup.string().required("Description is required"),
      quantity: Yup.number().required("Quantity is required"),
      categoryId: Yup.string().required("Category is required"),
      images: Yup.array().required("Images are required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setAvailableCategories(data.data);
      formik.setFieldValue("categoryId", data.data[0]._id);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...uploadedFiles]);
      formik.setFieldValue("images", [...images, ...uploadedFiles]);
      formik.setFieldTouched("images", true);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    formik.setFieldValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };
  console.log(images, "asa");
  console.log(formik.values, "asa");

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("productName", formik.values.productName);
      formData.append("price", formik.values.price);
      formData.append("description", formik.values.description);
      formData.append("quantity", formik.values.quantity);
      formData.append("categoryId", formik.values.categoryId);

      const data = await addProduct(formData);
      console.log(data);
      toast.success("Product added successfully");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error(error.response.data.message);
    }

    // Add logic to send data to the backend
  };
  console.log(formik.errors);

  return (
    <div className="p-6 mx-auto mt-10 max-w-2xl container shadow-md border border-gray-200 rounded-md">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="flex gap-6 w-full ">
          <TextInput
            name="productName"
            label={"Product Name"}
            placeholder="Enter the product name"
            type="text"
            formik={formik}
          />
          <TextInput
            label={"Price"}
            name="price"
            placeholder="Enter the price"
            type="number"
            formik={formik}
          />
        </div>
        <div className="flex gap-6 w-full">
          <div className="flex h-[4rem] flex-col gap-1 w-full">
            <label
              htmlFor="categoryId"
              className="text-sm text-gray-600 font-semibold"
            >
              Category
            </label>
            <select
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              name="categoryId"
              className="border p-2 rounded w-full"
            >
              {availableCategories.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            name="quantity"
            label={"Quantity"}
            placeholder="Enter the quantity"
            type="number"
            formik={formik}
          />
        </div>

        <div className="flex  flex-col gap-1 w-full">
          <label
            htmlFor="description"
            className="text-sm text-gray-600 font-semibold"
          >
            Description
          </label>
          <textarea
            className={`rounded-md border p-2 focus:outline-black ${
              formik.errors.description && formik.touched.description
                ? "border-red-500"
                : ""
            }`}
            name="description"
            id="description"
            placeholder="Enter the description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-xs text-red-500">
              {String(formik.errors.description)}
            </div>
          )}
        </div>

        <div className="flex  flex-col gap-1 w-full mb-4">
          <label
            htmlFor="images"
            className="text-sm text-gray-600 font-semibold"
          >
            Images
          </label>
          <input
            type="file"
            accept="image/*"
            name="images"
            id="images"
            multiple
            onChange={handleImageUpload}
            onBlur={() => formik.setFieldTouched("images", true)}
            className="w-full p-2 border rounded-lg"
          />
          <div className="mt-2 space-y-2">
            {images.map((image, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{image.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {formik.touched.images && formik.errors.images && (
            <div className="text-xs text-red-500">
              {String(formik.errors.images)}
            </div>
          )}
        </div>
        <Button buttonName={"Add Product"} type={"submit"} className={""} />
      </form>
    </div>
  );
};

export default AddProductPage;
