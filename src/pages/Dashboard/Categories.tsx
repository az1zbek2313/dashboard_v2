import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ApiResponse>({
    male: [],
    female: [],
    kids: [],
  });
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
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-black/70">Categories</h1>
        <button
          onClick={() => {
            setIsModalOpenTwo(true);
          }}
          className="bg-blue-500 text-white h-fit py-1 px-2 rounded dark:bg-blue-700"
        >
          Add Category
        </button>
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
                  className="bg-gray-300 dark:bg-gray-700 dark:text-gray-200 p-2 rounded mr-2"
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
          {categories ? (
           <table className="min-w-full divide-y divide-gray-200">
           <thead className="border-b-[1.5px]">
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
           <tbody className="divide-y divide-gray-200">
             {['male', 'female', 'kids'].map(
               (gender) =>
                 categories[gender as keyof ApiResponse]?.map(
                   (category, index) => (
                     <tr
                       onMouseLeave={() => {
                         setIsAction('');
                       }}
                       onClick={() => viewCategoryProducts(category._id)}
                       className="hover:bg-blue-50 transition-all duration-200 cursor-pointer border-y odd:bg-white even:bg-gray-50"
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
                                 return
                               }}
                             >
                               Delete
                             </button>
                           </li>
                         </ul>
                       )}
                       {/* <td className="p-2 text-center">
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
                       </td> */}
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
