import { useNavigate } from "react-router-dom";
import Button from "../../../components/button";
import { useEffect, useState } from "react";
import { softDeleteProduct } from "../../../api/product.api";
import {
  getCategories,
  addCategory,
  updateCategory,
} from "../../../api/category.api";
import TextInput from "../../../components/textInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const CategoryListsPage = () => {
  const navigate = useNavigate();
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);

  const formik = useFormik({
    enableReinitialize: true, // Allow reinitialization of values when `initialValues` changes
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await addCategory(values);
        fetchCategories();
        closeAddCategoryModal();
        toast.success(data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Failed to add category:", error);
      }
    },
  });

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setAvailableCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (categoryId) => {
    try {
      const data = await softDeleteProduct(categoryId, true); // soft delete
      console.log(data);
      fetchCategories(); // Refetch the data after deleting
      setShowDeleteModal(false); // Close the modal
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const openDeleteModal = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setShowDeleteModal(false);
  };

  const openUpdateCategoryModal = (category) => {
    setCategoryToUpdate({
      categoryId: category._id,
      categoryName: category.name,
    });
    formik.setFieldValue("name", category.name);
    setShowUpdateCategoryModal(true);
  };

  const closeUpdateCategoryModal = () => {
    setCategoryToUpdate(null);
    setShowUpdateCategoryModal(false);
  };

  const openAddCategoryModal = () => {
    setShowAddCategoryModal(true);
  };

  const closeAddCategoryModal = () => {
    formik.resetForm();
    setShowAddCategoryModal(false);
  };

  // update function
  const updateCategories = async () => {
    try {
      const data = await updateCategory(
        categoryToUpdate.categoryId,
        formik.values.name
      );
      console.log(data);
      fetchCategories(); // Refetch the data after updating
      closeUpdateCategoryModal();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  console.log(formik.values.name);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Category Details</h1>
      <div className="flex justify-between mb-2 items-center">
        <div></div>
        <Button
          buttonName={"Add Category"}
          handleOnClick={openAddCategoryModal}
          className="h-fit w-fit"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {availableCategories?.map((category) => (
              <tr key={category.id} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-1">
                  {category.name}
                </td>
                <td className="border border-gray-300 px-4 py-1 flex gap-2">
                  <Button
                    buttonName={"Update"}
                    handleOnClick={() => openUpdateCategoryModal(category)}
                  />
                  <Button
                    buttonName={"Delete"}
                    handleOnClick={() => openDeleteModal(category._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => deleteCategory(categoryToDelete)}
        message={"Are you sure you want to delete this category?"}
      />

      {/* Update Category Modal */}
      <Modal
        show={showUpdateCategoryModal}
        onClose={closeUpdateCategoryModal}
        onConfirm={() => {
          // Logic to update category
          updateCategories();
          console.log("Updating category:", categoryToUpdate);
        }}
        message={`Are you sure you want to update category name: ${categoryToUpdate?.categoryName}?`}
        disableConfirm={formik.values.name === categoryToUpdate?.categoryName}
      >
        <TextInput
          name="name"
          label={"Category Name"}
          placeholder="Enter the category name"
          type="text"
          formik={formik}
        />
      </Modal>

      {/* Add Category Modal */}
      <Modal
        show={showAddCategoryModal}
        onClose={closeAddCategoryModal}
        onConfirm={formik.handleSubmit}
        message={"Add New Category"}
      >
        <TextInput
          name="name"
          label={"Category Name"}
          placeholder="Enter the category name"
          type="text"
          formik={formik}
        />
      </Modal>
    </div>
  );
};

const Modal = ({
  show,
  onClose,
  onConfirm,
  message,
  children,
  disableConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h3 className="text-lg font-semibold">{message}</h3>
        {children}
        <div className="mt-4 flex justify-end">
          <button
            className={`bg-red-500 text-white py-2 px-4 rounded mr-2 cursor-pointer ${
              disableConfirm ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={onConfirm}
            disabled={disableConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryListsPage;
