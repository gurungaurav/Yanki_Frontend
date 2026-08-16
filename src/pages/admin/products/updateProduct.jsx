import { useEffect, useState } from "react";
import Button from "../../../components/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCategories } from "../../../api/category.api";
import TextInput from "../../../components/textInput";
import { updateProduct, getSpecificProduct } from "../../../api/product.api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { MdClose, MdCloudUpload } from "react-icons/md";

const UpdateProductPage = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const { productId } = useParams();
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      price: "",
      description: "",
      stockQuantity: 0,
      categoryId: "",
      images: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      price: Yup.number().min(10).required("Price is required"),
      description: Yup.string().required("Description is required"),
      stockQuantity: Yup.number().min(1).required("Quantity is required"),
      categoryId: Yup.string().required("Category is required"),
      images: Yup.array().min(1, "At least one image is required"),
    }),
    onSubmit: async (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await getSpecificProduct(productId);

      const initialFormValues = {
        name: response.data.name,
        price: response.data.price,
        description: response.data.description,
        stockQuantity: response.data.stockQuantity,
        categoryId: response.data.categoryId._id,
        images: response.data.images,
      };
      setInitialValues(initialFormValues);
      formik.setValues(initialFormValues);
      setImagePreviews(
        response.data.images.map((image) => ({
          imageUrl: image.imageUrl,
          _id: image._id,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch product:", error);
      toast.error("Failed to fetch product details");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories({ isDeleted: false });
      setAvailableCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      setNewImages((prevImages) => [...prevImages, ...uploadedFiles]);
      formik.setFieldValue("images", [
        ...formik.values.images,
        ...uploadedFiles,
      ]);

      const previews = uploadedFiles.map((file) => ({
        imageUrl: URL.createObjectURL(file),
        _id: null,
        isNew: true,
      }));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    const removedImage = updatedPreviews.splice(index, 1)[0];
    setImagePreviews(updatedPreviews);

    if (removedImage._id && !removedImage.isNew) {
      setRemovedImageIds((prevIds) => [...prevIds, removedImage._id]);
    } else {
      const newImageIndex = imagePreviews
        .slice(0, index)
        .filter((img) => img.isNew).length;
      setNewImages((prevImages) =>
        prevImages.filter((_, i) => i !== newImageIndex)
      );
    }

    formik.setFieldValue(
      "images",
      formik.values.images.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (values) => {
    try {
      const updatedValues = {};
      Object.keys(values).forEach((key) => {
        if (values[key] !== initialValues[key]) {
          updatedValues[key] = values[key];
        }
      });

      const formData = new FormData();
      Object.entries(updatedValues).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, value);
        }
      });

      newImages.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("imagesToDelete", JSON.stringify(removedImageIds));
      const response = await updateProduct(productId, formData);
      toast.success(response.message);
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="">
        <div className="flex justify-center items-center h-64 md:h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-600">
              Loading product...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
            Update Product
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Modify the product details below
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Product Name and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <TextInput
                name="name"
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
                name="stockQuantity"
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

          {/* Images Management */}
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="images"
              className="text-sm md:text-base text-gray-700 font-semibold"
            >
              Product Images
            </label>

            {/* Current Images */}

            {/* Upload New Images */}
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
            {imagePreviews.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm md:text-base font-medium text-gray-700 mb-3">
                  Current Images ({imagePreviews.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.imageUrl}
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
                      <div className="mt-1">
                        <p className="text-xs text-gray-600">
                          {image.isNew ? "New" : "Existing"}
                        </p>
                      </div>
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
              buttonName="Update Product"
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

export default UpdateProductPage;
