import { useEffect, useState } from "react";
import Button from "../../../components/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCategories } from "../../../api/category.api";
import TextInput from "../../../components/textInput";
import { addProduct } from "../../../api/product.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdClose, MdCloudUpload, MdImage } from "react-icons/md";

const AddProductPage = () => {
  const [images, setImages] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const navigate = useNavigate();

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
      price: Yup.number().min(10).required("Price is required"),
      description: Yup.string().required("Description is required"),
      quantity: Yup.number().min(1).required("Quantity is required"),
      categoryId: Yup.string().required("Category is required"),
      images: Yup.array()
        .min(1, "At least one image is required")
        .required("Images are required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const fetchCategories = async () => {
    try {
      const data = await getCategories({ isDeleted: false });
      setAvailableCategories(data.data);
      if (data.data.length > 0) {
        formik.setFieldValue("categoryId", data.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      const newImages = [...images, ...uploadedFiles];
      setImages(newImages);
      formik.setFieldValue("images", newImages);
      formik.setFieldTouched("images", true);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    formik.setFieldValue("images", newImages);
  };

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
      toast.success(data.message);
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="  ">
      <div className="bg-white shadow-md border border-gray-200 rounded-xl p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
            Add New Product
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Fill in the details to add a new product to your inventory
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Product Name and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <TextInput
                name="productName"
                label="Product Name"
                placeholder="Enter the product name"
                type="text"
                formik={formik}
              />
            </div>
            <div>
              <TextInput
                label="Price (NPR)"
                name="price"
                placeholder="Enter the price"
                type="number"
                formik={formik}
              />
            </div>
          </div>

          {/* Category and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="categoryId"
                className="text-sm md:text-base text-gray-700 font-semibold"
              >
                Category
              </label>
              <select
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="categoryId"
                className={`border border-gray-300 p-2 md:p-3 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full ${
                  formik.errors.categoryId && formik.touched.categoryId
                    ? "border-red-500"
                    : ""
                }`}
              >
                <option value="">Select a category</option>
                {availableCategories.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <div className="text-xs md:text-sm text-red-500 mt-1">
                  {formik.errors.categoryId}
                </div>
              )}
            </div>

            <div>
              <TextInput
                name="quantity"
                label="Stock Quantity"
                placeholder="Enter the quantity"
                type="number"
                formik={formik}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="description"
              className="text-sm md:text-base text-gray-700 font-semibold"
            >
              Description
            </label>
            <textarea
              className={`rounded-lg border border-gray-300 p-2 md:p-3 text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] md:min-h-[120px] resize-vertical ${
                formik.errors.description && formik.touched.description
                  ? "border-red-500"
                  : ""
              }`}
              name="description"
              id="description"
              placeholder="Enter a detailed description of the product"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-xs md:text-sm text-red-500 mt-1">
                {formik.errors.description}
              </div>
            )}
          </div>

          {/* Images Upload */}
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="images"
              className="text-sm md:text-base text-gray-700 font-semibold"
            >
              Product Images
            </label>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                name="images"
                id="images"
                multiple
                onChange={handleImageUpload}
                onBlur={() => formik.setFieldTouched("images", true)}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <MdCloudUpload className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                <div className="text-sm md:text-base text-gray-600">
                  <span className="font-medium text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm md:text-base font-medium text-gray-700 mb-3">
                  Uploaded Images ({images.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors "
                      >
                        <MdClose className="h-6 w-6" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formik.touched.images && formik.errors.images && (
              <div className="text-xs md:text-sm text-red-500 mt-1">
                {formik.errors.images}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
            <Button
              type="button"
              buttonName="Cancel"
              handleOnClick={() => navigate("/dashboard/products")}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600"
            />
            <Button
              buttonName="Add Product"
              type="submit"
              className="w-full sm:w-auto"
              disabled={formik.isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
