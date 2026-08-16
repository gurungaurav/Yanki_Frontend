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
import { MdEdit, MdDelete, MdRestore } from "react-icons/md";

const CategoryListsPage = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    enableReinitialize: true,
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
      setLoading(true);
      const data = await getCategories();
      setAvailableCategories(data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategoryById = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      fetchCategories();
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Failed to delete category:", error);
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

  const updateCategories = async () => {
    try {
      const data = await updateCategory(
        categoryToUpdate.categoryId,
        formik.values.name
      );
      toast.success(data.message);
      fetchCategories();
      closeUpdateCategoryModal();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  if (loading) {
    return (
      <div className="">
        <div className="flex justify-center items-center h-64 md:h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-lg md:text-xl font-semibold text-gray-600">
              Loading categories...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-start mb-4 ">
        Category Management
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="text-sm md:text-base text-gray-600">
          Manage your product categories
        </div>
        <Button
          buttonName="Add Category"
          handleOnClick={openAddCategoryModal}
          className="w-full sm:w-auto flex items-center gap-2"
        />
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {availableCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-gray-600">
              No categories found
            </p>
          </div>
        ) : (
          availableCategories?.map((category) => (
            <div
              key={category._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-base text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        category.isDeleted ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {category.isDeleted ? "Deleted" : "Active"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openUpdateCategoryModal(category)}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors flex-1"
                >
                  <MdEdit className="h-4 w-4" />
                  Update
                </button>
                <button
                  onClick={() => deleteCategoryById(category._id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded text-sm transition-colors flex-1 ${
                    category.isDeleted
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {category.isDeleted ? (
                    <>
                      <MdRestore className="h-4 w-4" />
                      Restore
                    </>
                  ) : (
                    <>
                      <MdDelete className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {availableCategories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8">
                  <p className="text-lg font-semibold text-gray-600">
                    No categories found
                  </p>
                </td>
              </tr>
            ) : (
              availableCategories?.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.isDeleted
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {category.isDeleted ? "Deleted" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openUpdateCategoryModal(category)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-xs"
                        title="Update Category"
                      >
                        <MdEdit className="h-3 w-3" />
                        Update
                      </button>
                      <button
                        onClick={() => deleteCategoryById(category._id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded transition-colors text-xs ${
                          category.isDeleted
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                        title={
                          category.isDeleted
                            ? "Restore Category"
                            : "Delete Category"
                        }
                      >
                        {category.isDeleted ? (
                          <>
                            <MdRestore className="h-3 w-3" />
                            Restore
                          </>
                        ) : (
                          <>
                            <MdDelete className="h-3 w-3" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
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
        onConfirm={updateCategories}
        message={`Update category: ${categoryToUpdate?.categoryName}`}
        disableConfirm={formik.values.name === categoryToUpdate?.categoryName}
        className="p-4 sm:p-6"
      >
        <div className="mt-4">
          <TextInput
            name="name"
            label="Category Name"
            placeholder="Enter the category name"
            type="text"
            formik={formik}
          />
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        show={showAddCategoryModal}
        onClose={closeAddCategoryModal}
        onConfirm={formik.handleSubmit}
        message="Add New Category"
        className="p-4 sm:p-6"
      >
        <div className="mt-4">
          <TextInput
            name="name"
            label="Category Name"
            placeholder="Enter the category name"
            type="text"
            formik={formik}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CategoryListsPage;
