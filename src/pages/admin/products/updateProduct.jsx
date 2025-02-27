import { useEffect, useState } from "react";
import Button from "../../../components/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getCategories } from "../../../api/category.api";
import TextInput from "../../../components/textInput";
import { updateProduct, getSpecificProduct } from "../../../api/product.api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UpdateProductPage = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newImages, setNewImages] = useState([]); // For newly uploaded images
  const [imagePreviews, setImagePreviews] = useState([]); // To store image previews
  const [initialValues, setInitialValues] = useState({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      stockQuantity: product.stockQuantity || 0,
      categoryId: product.categoryId?._id || "",
      images: product.images || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      price: Yup.number().required("Price is required"),
      description: Yup.string().required("Description is required"),
      stockQuantity: Yup.number().required("Quantity is required"),
      categoryId: Yup.string().required("Category is required"),
      images: Yup.array().min(3, "At least three image is required"),
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
      setProduct(response.data);
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
      setImagePreviews(response.data.images.map((image) => image.imageUrl));
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setAvailableCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
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
      // Generate previews for each uploaded file
      const previews = uploadedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  console.log(imagePreviews, "kaka");

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    if (index < product.images.length) {
      // If the image is from the existing product, mark it for removal
      setRemovedImageIds((prevIds) => [
        ...prevIds,
        { _id: product.images[index]._id },
      ]);
    } else {
      // If the image is newly uploaded, remove it from newImages
      setNewImages((prevImages) =>
        prevImages.filter((_, i) => i !== index - product.images.length)
      );
    }

    // Update Formik's images field
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

      formData.append(
        "imagesToDelete",
        JSON.stringify(removedImageIds.map((item) => item._id))
      );

      console.log("Form data:", formData.get("images"));
      console.log("Form data:", formData.get("imagesToDelete"));

      const response = await updateProduct(productId, formData);
      toast.success("Product updated successfully!");
      console.log("Updated product:", response.data);
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  console.log(removedImageIds, "kaka");

  const isFormChanged = () => {
    return (
      JSON.stringify(formik.values) !== JSON.stringify(initialValues) ||
      newImages.length > 0 ||
      removedImageIds.length > 0
    );
  };

  console.log(imagePreviews, "snsjd");

  return (
    <div className="p-6 mx-auto mt-10 max-w-2xl container shadow-md border border-gray-200 rounded-md">
      <h2 className="text-xl font-bold mb-4">Update Product</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        <div className="flex gap-6 w-full">
          <TextInput
            name="name"
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
            name="stockQuantity"
            label={"Quantity"}
            placeholder="Enter the quantity"
            type="number"
            formik={formik}
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
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

        <div className="flex flex-col gap-1 w-full mb-4">
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
            className="w-full p-2 border rounded-lg"
          />
          {/* Display images */}
          {imagePreviews.map((image, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt={`Preview ${index}`}
                  className="w-12 h-12 object-cover rounded"
                />
                <span className="text-sm">Image {index + 1}</span>
              </div>
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
        <Button
          buttonName={"Update Product"}
          type={"submit"}
          disabled={!isFormChanged()}
        />
      </form>
    </div>
  );
};

export default UpdateProductPage;
