import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import notfound from '../../images/notfound/notfound.png';

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
  const [isAction, setIsAction] = useState('');
  const searchRef = useRef();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ApiResponse>({
    male: [],
    female: [],
    kids: [],
  });
  const [isSearch, setIsSearch] = useState<ApiResponse>(categories);

  const [newCategory, setNewCategory] = useState({
    uz: '',
    ru: '',
    gender: '',
  });
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('token');

  // Fetch categories
  const fetchCategories = () => {
    axios
      .get('https://surprize.uz/api/category', {
        headers: { 'Content-Type': 'application/json', token: getToken() },
      })
      .then((response) => {
        setCategories(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
  }, []);

  function handleSearch(data: ApiResponse) {
    const upperSearch = searchRef.current?.value.toUpperCase();
    if (upperSearch) {
      const filtered: ApiResponse = {
        male: data.male.filter((category) =>
          category.name.uz.toUpperCase().includes(upperSearch)
        ),
        female: data.female.filter((category) =>
          category.name.uz.toUpperCase().includes(upperSearch)
        ),
        kids: data.kids.filter((category) =>
          category.name.uz.toUpperCase().includes(upperSearch)
        ),
      };
      setIsSearch(filtered);
    } else {
      setIsSearch(data);
    }
  }
  

  useEffect(() => {
    setIsSearch(categories);
  }, [categories]);

  // Create category
  const createCategory = () => {
    const { uz, ru, gender } = newCategory;

    axios
      .post(
        'https://surprize.uz/api/category',
        {
          name_uz: uz,
          name_ru: ru,
          gender: [gender],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token: getToken(),
          },
        },
      )
      .then(() => {
        setNewCategory({ uz: '', ru: '', gender: '' });
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
            'Content-Type': 'application/json',
            token: getToken(),
          },
        },
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
          'Content-Type': 'application/json',
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black/70">Categories</h1>
        <div className="flex gap-2 items-center">
          <form className="">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke-width="2"
                    d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                  />
                </svg>
              </div>
              <input
                type="search"
                ref={searchRef}
                onChange={() => handleSearch(categories)}
                id="simple-search"
                className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                placeholder="Search category name..."
                required
              />
            </div>
          </form>
          <button
            onClick={() => {
              setIsModalOpenTwo(true);
            }}
            className="bg-blue-500 text-white h-fit py-2 px-2 rounded-lg"
          >
            Add Category
          </button>
        </div>
      </div>

      {isModalOpenTwo && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-1/4 shadow-lg">
            <h2 className="text-xl mb-4 dark:text-white">New Category</h2>
            <form
              className="flex flex-col"
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpenTwo(false);
              }}
            >
              <input
                type="text"
                placeholder="Uzbek name"
                className="border p-2 rounded mb-2"
                value={newCategory.uz}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, uz: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Russian name"
                className="border p-2 rounded mb-2"
                value={newCategory.ru}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, ru: e.target.value })
                }
              />
              <select
                className="border focus:border-none cursor-pointer p-2 rounded mb-2"
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

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpenTwo(false);
                  }}
                  className="bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={createCategory}
                  className="bg-blue-500 dark:bg-blue-600 text-white p-2 rounded"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        {!isLoading ? (
          <div className="overflow-x-auto">
            {Object.values(isSearch).flat().length > 0 ? (
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="p-2 text-start text-sm font-semibold uppercase text-black">
                      Category (UZ)
                    </th>
                    <th className="p-2 text-start text-sm font-semibold uppercase text-black">
                      Category (RU)
                    </th>
                    <th className="p-2 text-start text-sm font-semibold uppercase text-black">
                      Gender
                    </th>
                    <th className="p-2 text-center text-sm font-semibold uppercase text-black">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {['male', 'female', 'kids'].map(
                    (gender) =>
                      isSearch[gender as keyof ApiResponse]?.map(
                        (category, index) => (
                          <tr
                            onMouseLeave={() => {
                              setIsAction('');
                            }}
                            onClick={() => viewCategoryProducts(category._id)}
                            className="hover:bg-red-50 border-gray-300  transition-all duration-200 cursor-pointer border-y odd:bg-white even:bg-blue-50"
                            key={`${category._id}-${index}`}
                          >
                            <td className="p-2">{category.name.uz}</td>
                            <td className="p-2">{category.name.ru}</td>
                            <td className="p-2">
                              {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </td>
                            <td
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsAction(category._id);
                              }}
                              className="p-2 text-center whitespace-nowrap"
                            >
                              <button className="text-lg font-medium hover:underline text-blue-600">
                                ...
                              </button>
                            </td>
                            {isAction == category._id && (
                              <ul className="absolute scale-110 right-18 border-[1.5px] rounded-md flex flex-col bg-white z-[10000]">
                                <li className="text-start py-[.5px] px-2 hover:bg-blue-50 sm:table-cell whitespace-nowrap">
                                  <button
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      return openEditModal(category);
                                    }}
                                  >
                                    Update
                                  </button>
                                </li>
                                <li className="text-center py-[.5px] px-2 hover:bg-red-50 whitespace-nowrap">
                                  <button
                                    className="text-sm font-medium text-red-600 hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteCategory(category._id);
                                      setIsAction('');
                                      return;
                                    }}
                                  >
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            )}
                          </tr>
                        ),
                      ),
                  )}
                </tbody>
              </table>
            ) : (
              <div className="min-h-[50vh] w-full sm:h-[60vh] lg:min-h-[70vh] flex justify-center items-center">
                <div className="flex flex-col gap-2 md:gap-4 justify-center items-center">
                  <div className="w-full flex justify-center">
                    <img src={notfound} alt="search box icon" className="" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div role="status" className=" animate-pulse">
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-md  w-full mb-4"></div>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>

      {isModalOpen && editCategory && (
        <div className="fixed inset-0 z-[10000] bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg flex flex-col gap-1 w-1/4">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-300">
              Edit Category
            </h2>
            <input
              type="text"
              placeholder="Uzbek name"
              className="border p-2 rounded mb-2"
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
              className="border p-2 rounded mb-2"
              value={editCategory.name.ru}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  name: { ...editCategory.name, ru: e.target.value },
                })
              }
            />
            <select
              className="border p-2 rounded mb-2"
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
