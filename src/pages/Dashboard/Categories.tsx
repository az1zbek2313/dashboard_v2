import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Category {
  name: {
    uz: string;
    ru: string;
  };
  _id: string;
  products: string[];
  gender: string[];
}

interface ApiResponse {
  male: Category[];
  female: Category[];
  kids: Category[];
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<ApiResponse>({
    male: [],
    female: [],
    kids: [],
  });
  const [newCategory, setNewCategory] = useState({
    uz: "",
    ru: "",
    gender: "",
  });
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  // Fetch categories
  const fetchCategories = () => {
    axios
      .get("https://surprize.uz/api/category", {
        headers: { "Content-Type": "application/json", token: getToken() },
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create category
  const createCategory = () => {
    const { uz, ru, gender } = newCategory;

    axios
      .post(
        "https://surprize.uz/api/category",
        {
          name_uz: uz,
          name_ru: ru,
          gender: [gender],
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: getToken(),
          },
        }
      )
      .then(() => {
        setNewCategory({ uz: "", ru: "", gender: "" });
        fetchCategories();
      })
      .catch((error) => console.error(error));
  };

  // Update category
  const updateCategory = (id: string) => {
    if (!editCategory) return;

    const { uz, ru } = editCategory.name;
    const { gender } = editCategory;

    axios
      .put(
        `https://surprize.uz/api/category/${id}`,
        {
          name_uz: uz,
          name_ru: ru,
          gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: getToken(),
          },
        }
      )
      .then(() => {
        setIsModalOpen(false);
        fetchCategories();
      })
      .catch((error) => console.error(error));
  };

  // Delete category
  const deleteCategory = (id: string) => {
    axios
      .delete(`https://surprize.uz/api/category/${id}`, {
        headers: {
          "Content-Type": "application/json",
          token: getToken(),
        },
      })
      .then(() => fetchCategories())
      .catch((error) => console.error(error));
  };

  // View category products
  const viewCategoryProducts = (id: string) => {
    navigate(`/category/${id}`);
  };

  // Open modal for editing
  const openEditModal = (category: Category) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-300">Categories</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Uzbek name"
          className="border p-2 rounded mb-2 dark:bg-gray-700 dark:text-gray-300"
          value={newCategory.uz}
          onChange={(e) =>
            setNewCategory({ ...newCategory, uz: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Russian name"
          className="border p-2 rounded mb-2 dark:bg-gray-700 dark:text-gray-300"
          value={newCategory.ru}
          onChange={(e) =>
            setNewCategory({ ...newCategory, ru: e.target.value })
          }
        />
        <select
          className="border p-2 rounded mb-2 dark:bg-gray-700 dark:text-gray-300"
          value={newCategory.gender}
          onChange={(e) =>
            setNewCategory({ ...newCategory, gender: e.target.value })
          }
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="kids">Kids</option>
        </select>
        <button
          onClick={createCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      {["male", "female", "kids"].map((gender) => (
        <div key={gender}>
          <h2 className="text-xl font-bold mt-4 mb-2 dark:text-gray-300">
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </h2>
          <div className="rounded-sm border shadow-default dark:border-gray-700">
            <table className="w-full table-auto">
              <thead className="bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-2 text-left">Category (UZ)</th>
                  <th className="p-2 text-left">Category (RU)</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories[gender as keyof ApiResponse]?.map((category) => (
                  <tr key={category._id} className="dark:text-gray-300">
                    <td className="p-2">{category.name.uz}</td>
                    <td className="p-2">{category.name.ru}</td>
                    <td className="p-2">
                      <button
                        onClick={() => viewCategoryProducts(category._id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2 dark:bg-green-700"
                      >
                        View Products
                      </button>
                      <button
                        onClick={() => openEditModal(category)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 dark:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded dark:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {isModalOpen && editCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
              Edit Category
            </h2>
            <input
              type="text"
              placeholder="Uzbek name"
              className="border p-2 rounded mb-2 dark:bg-gray-700 dark:text-gray-300"
              value={editCategory.name.uz}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  name: { ...editCategory.name, uz: e.target.value },
                })
              }
            />
            <input
              type="text"
              placeholder="Russian name"
              className="border p-2 rounded mb-2 dark:bg-gray-700 dark:text-gray-300"
              value={editCategory.name.ru}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  name: { ...editCategory.name, ru: e.target.value },
                })
              }
            />
            <select
              className="border p-2 rounded mb-2 dark:bg-gray-700 dark:text-gray-300"
              value={editCategory.gender[0]}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  gender: [e.target.value],
                })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="kids">Kids</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 dark:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => updateCategory(editCategory._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
