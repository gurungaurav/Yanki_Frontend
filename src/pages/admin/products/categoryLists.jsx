import Button from "../../../components/button";
import { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/category.api";
import TextInput from "../../../components/textInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Modal } from "../../../components/modal";

const CategoryListsPage = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
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

  const deleteCategoryById = async (categoryId) => {
    try {
      await deleteCategory(categoryId); // soft delete
      fetchCategories(); // Refetch the data after deleting
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to delete product:", error);
    }
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
      toast.success(data.message);
      fetchCategories(); // Refetch the data after updating
      closeUpdateCategoryModal();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

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
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {availableCategories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">
                  No categories found
                </td>
              </tr>
            ) : (
              availableCategories?.map((category) => (
                <tr key={category.id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-1">
                    {category.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-1">
                    {category.isDeleted ? "Deleted" : "Active"}
                  </td>
                  <td className="border border-gray-300 px-4 py-1 flex gap-2">
                    <Button
                      buttonName={"Update"}
                      handleOnClick={() => openUpdateCategoryModal(category)}
                    />
                    <button
                      onClick={() => deleteCategoryById(category._id)}
                      className={`p-2  cursor-pointer opacity-90 rounded-md duration-300 ${
                        category.isDeleted
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {category.isDeleted ? "Restore" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Category Modal */}
      <Modal
        show={showUpdateCategoryModal}
        onClose={closeUpdateCategoryModal}
        onConfirm={() => {
          // Logic to update category
          updateCategories();
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

export default CategoryListsPage;
