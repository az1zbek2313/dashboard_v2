// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Category {
//   name: {
//     uz: string;
//     ru: string;
//   };
//   _id: string;
//   products: string[];
// }

// const Categories: React.FC = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [newCategory, setNewCategory] = useState({ uz: "", ru: "" });
//   const navigate = useNavigate();
//   const getToken = () => localStorage.getItem('token');

//   // Fetch all categories
//   useEffect(() => {
//     axios.get("https://surprize.uz/api/category")
//       .then((response) => {
//         setCategories(response.data);
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   // Create a new category
//   const createCategory = () => {
//     axios.post("https://surprize.uz/api/category", { name: newCategory },{headers: { 'Content-Type': 'application/json', token:getToken()}})
//       .then(() => {
//         setNewCategory({ uz: "", ru: "" });
//         fetchCategories();
//       })
//       .catch((error) => console.error(error));
//   };

//   // Update category
//   const updateCategory = (id: string) => {
//     axios.put(`https://surprize.uz/api/category/${id}`, { name: newCategory },{headers: { 'Content-Type': 'application/json', token:getToken()}})
//       .then(() => fetchCategories())
//       .catch((error) => console.error(error));
//   };

//   // Delete category
//   const deleteCategory = (id: string) => {
//     axios.delete(`https://surprize.uz/api/category/${id}`,{headers: { 'Content-Type': 'application/json', token:getToken()}})
//       .then(() => fetchCategories())
//       .catch((error) => console.error(error));
//   };

//   const fetchCategories = () => {
//     axios.get("https://surprize.uz/api/category",{headers: { 'Content-Type': 'application/json', token:getToken()}})
//       .then((response) => {
//         setCategories(response.data);
//       })
//       .catch((error) => console.error(error));
//   };

//   const viewCategoryProducts = (id: string) => {
//     navigate(`/category/${id}/products`);
//   };

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Categories</h1>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Uzbek name"
//           className="border p-2 rounded mb-2"
//           value={newCategory.uz}
//           onChange={(e) => setNewCategory({ ...newCategory, uz: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Russian name"
//           className="border p-2 rounded mb-2"
//           value={newCategory.ru}
//           onChange={(e) => setNewCategory({ ...newCategory, ru: e.target.value })}
//         />
//         <button
//           onClick={createCategory}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add Category
//         </button>
//       </div>

//       <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
//         <table className="w-full table-auto">
//           <thead className="bg-gray-2 dark:bg-meta-4">
//             <tr>
//               <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Category (UZ)</th>
//               <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Category (RU)</th>
//               <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((category) => (
//               <tr key={category._id}>
//                 <td className="p-2.5 xl:p-5 text-sm">{category.name.uz}</td>
//                 <td className="p-2.5 xl:p-5 text-sm">{category.name.ru}</td>
//                 <td className="p-2.5 xl:p-5">
//                   <button
//                     onClick={() => viewCategoryProducts(category._id)}
//                     className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//                   >
//                     View Products
//                   </button>
//                   <button
//                     onClick={() => updateCategory(category._id)}
//                     className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteCategory(category._id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Categories;
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
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ uz: "", ru: "" });
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const getToken = () => localStorage.getItem('token');
  console.log('getToken :', getToken());

  // Fetch all categories
  useEffect(() => {
    axios.get("https://surprize.uz/api/category",{headers: { 'Content-Type': 'application/json', token:getToken()}})
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

// Get token from local storage
const createCategory = () => {
  const formData = new FormData();
  formData.append('name_uz', newCategory.uz);
  formData.append('name_ru', newCategory.ru);

  axios.post('https://surprize.uz/api/category', formData, {
    headers: {
        token: getToken(),

    },
  })
  .then(() => {
    setNewCategory({ uz: '', ru: '' });
    fetchCategories();
  })
  .catch((error) => console.error(error));
};

// Update category
const updateCategory = (id: string) => {
  if (!editCategory) return;

  const formData = new FormData();
  formData.append('name_uz', editCategory.name.uz);
  formData.append('name_ru', editCategory.name.ru);

  axios.put(`https://surprize.uz/api/category/${id}`, formData, {
    headers: {
      token: getToken(),
    },
  })
  .then(() => {
    setIsModalOpen(false);
    fetchCategories();
  })
  .catch((error) => console.error(error));
};

// Delete category
const deleteCategory = (id: string) => {
  axios.delete(`https://surprize.uz/api/category/${id}`, {
    headers: {
        token: getToken(),

    },
  })
  .then(() => fetchCategories())
  .catch((error) => console.error(error));
};


  const fetchCategories = () => {
    axios.get("https://surprize.uz/api/category",{headers: { 'Content-Type': 'application/json', token:getToken()}})
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error(error));
  };

  const viewCategoryProducts = (id: string) => {
    navigate(`/category/${id}`);
  };

  // Open modal to edit category
  const openEditModal = (category: Category) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Categories</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Uzbek name"
          className="border p-2 rounded mb-2"
          value={newCategory.uz}
          onChange={(e) => setNewCategory({ ...newCategory, uz: e.target.value })}
        />
        <input
          type="text"
          placeholder="Russian name"
          className="border p-2 rounded mb-2"
          value={newCategory.ru}
          onChange={(e) => setNewCategory({ ...newCategory, ru: e.target.value })}
        />
        <button
          onClick={createCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <table className="w-full table-auto">
          <thead className="bg-gray-2 dark:bg-meta-4">
            <tr>
              <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Category (UZ)</th>
              <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Category (RU)</th>
              <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="p-2.5 xl:p-5 text-sm">{category.name.uz}</td>
                <td className="p-2.5 xl:p-5 text-sm">{category.name.ru}</td>
                <td className="p-2.5 xl:p-5">
                  <button
                    onClick={() => viewCategoryProducts(category._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  >
                    View Products
                  </button>
                  <button
                    onClick={() => openEditModal(category)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing category */}
      {isModalOpen && editCategory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Category</h2>
            <input
              type="text"
              placeholder="Uzbek name"
              className="border p-2 rounded mb-2"
              value={editCategory.name.uz}
              onChange={(e) =>
                setEditCategory({ ...editCategory, name: { ...editCategory.name, uz: e.target.value } })
              }
            />
            <input
              type="text"
              placeholder="Russian name"
              className="border p-2 rounded mb-2"
              value={editCategory.name.ru}
              onChange={(e) =>
                setEditCategory({ ...editCategory, name: { ...editCategory.name, ru: e.target.value } })
              }
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => updateCategory(editCategory._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
