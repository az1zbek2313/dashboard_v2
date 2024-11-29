import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';
import CardSkeleton from './CardSkeleton';

interface Product {
  name: {
    uz: string;
    ru: string;
  };
  description: {
    uz: string;
    ru: string;
  };
  reviews: any[];
  rating: number;
  _id: string;
  price: number;
  images: string[];
  count: number;
  id_name: string;
  __v: number;
}

interface Category {
  name: {
    uz: string;
    ru: string;
  };
  _id: string;
  products: string[];
  __v: number;
}

const Products: React.FC = () => {
  const searchRef = useRef();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchProduct, setSearchProduct] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  console.log('categories :', categories);
  const [store, setStore] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { store_id, token } = useAuth();

  const [formData, setFormData] = useState<any>({
    name: { uz: '', ru: '' },
    description: { uz: '', ru: '' },
    price: 0,
    count: 0,
    images: [],
    category_id: '',
    store_id: '',
  });
  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://surprize.uz/api/product');
      setProducts(response.data);
      setSearchProduct(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://surprize.uz/api/sub-category',
        );
        setCategories(response.data);
      } catch (err) {
        setError('Failed to fetch categories');
      }
    };
    const fetchStore = async () => {
      try {
        const response = await axios.get('https://surprize.uz/api/store');
        setStore(response.data);
      } catch (err) {
        setError('Failed to fetch categories');
      }
    };
    fetchProducts();
    fetchCategories();
    fetchStore();
  }, []);

  function searchProducts() {
    if (searchRef.current?.value == '') {
      setSearchProduct(products);
    } else {
      const upperSearch = searchRef.current?.value?.toUpperCase();
      if (upperSearch) {
        const filterProducts = products.filter((product) =>
          product.name.uz.toUpperCase().includes(upperSearch),
        );
        setSearchProduct(filterProducts);
      }
    }
  }

  useEffect(() => {
    searchProducts();
  }, [searchRef]);

  console.log(searchRef);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'count') {
      setFormData((prevData: any) => ({ ...prevData, [name]: Number(value) }));
    } else if (name === 'category_id') {
      setFormData((prevData: any) => ({ ...prevData, category_id: value }));
    } else if (name === 'store_id') {
      setFormData((prevData: any) => ({ ...prevData, store_id: value }));
    } else {
      const [key, lang] = name.split('.');
      setFormData((prevData: any) => ({
        ...prevData,
        [key]: {
          ...prevData[key],
          [lang]: value,
        },
      }));
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files); // Fayllarni massivga aylantirish
    if (files.length > 0) {
      setUploadedFiles(files);
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: { uz: product.name.uz, ru: product.name.ru },
        description: { uz: product.description.uz, ru: product.description.ru },
        price: product.price,
        count: product.count,
        images: product.images,
        category_id: product.category_id,
        store_id: store_id ? store_id : product.store_id,
      });
    } else {
      setFormData({
        name: { uz: '', ru: '' },
        description: { uz: '', ru: '' },
        price: 0,
        count: 0,
        images: [],
        category_id: '',
        store_id: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name_uz', formData.name.uz);
    data.append('name_ru', formData.name.ru);
    data.append('description_uz', formData.description.uz);
    data.append('description_ru', formData.description.ru);
    data.append('price', formData.price.toString());
    data.append('count', formData.count.toString());
    data.append('category_id', formData.category_id); // Append selected category ID
    data.append('store_id', formData.store_id); // Append selected store ID
    uploadedFiles.forEach((file) => {
      data.append('images', file); // Har bir faylni alohida qo'shish
    });

    try {
      if (selectedProduct) {
        console.log('Updating product...');

        const response = await axios.put(
          `https://surprize.uz/api/product/${selectedProduct._id}`,
          data,
          {
            headers: {
              token,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Response:', response.data); // Qaytgan ma'lumotni konsolga chiqarish
      } else {
        console.log('Adding new product...');
        for (let pair of data.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
        const response = await axios.post(
          'https://surprize.uz/api/product',
          data,
          {
            headers: {
              token,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        console.log('Response:', response.data); // Qaytgan ma'lumotni konsolga chiqarish
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error occurred:', error); // Xato haqida ma'lumotni konsolga chiqarish
      setError('Error occurred while saving product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://surprize.uz/api/product/${id}`, {
        headers: { 'Content-Type': 'application/json', token },
      });
      fetchProducts();
    } catch (error) {
      setError('Error occurred while deleting product');
    }
  };

  if (loading)
    return (
      <div className="bg-white p-5 flex justify-between items-center">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default">
      <div className="flex mb-6 justify-between items-center">
        <h4 className="text-3xl font-bold text-black/70">Mahsulotlar</h4>
        <div className="flex items-center gap-2">
          <form className="flex items-center max-w-sm mx-auto">
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
                onChange={searchProducts}
                id="simple-search"
                className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                placeholder="Search branch name..."
                required
              />
            </div>
          </form>

          <button
            onClick={() => openModal()}
            className="bg-blue-500 text-white px-2 py-2  rounded-lg hover:bg-blue-600 active:bg-blue-400 transition-all duration-200"
          >
            Add Product
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {searchProduct.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg px-3 pt-1 pb-2 shadow-md bg-white dark:bg-gray-800"
          >
            {product.images.length > 0 && (
              <img
                src={'https://surprize.uz' + product.images[0]}
                alt={product.name?.uz}
                className="w-full h-64 rounded mt-2 object-cover" // Tasvirning kengligi va balandligi 256px bo'ladi
              />
            )}

            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold my-2 text-black">
                {product.name?.uz}
              </h2>
              <div className="flex items-center gap-2">
                <svg
                  onClick={() => openModal(product)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  color="blue"
                  className="bi bi-pencil-square cursor-pointer hover:scale-105 transition-all duration-200"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>
                <svg
                  onClick={() => handleDelete(product._id)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  color="red"
                  className="bi bi-trash3-fill cursor-pointer hover:scale-105 transition-all duration-200"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Description: `}</span>
              <span className="text-sm text-gray-500">{`${product.description?.uz}`}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Price: `}</span>
              <span className="text-sm text-gray-500">${product.price}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Available Count: `}</span>
              <span className="text-sm text-gray-500">{product.count}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Category: `}</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Gender: `}</span>
              <span className="text-sm text-gray-500">{product.gender}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Product ID: `}</span>
              <span className="text-sm text-gray-500">{product._id}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Store ID: `}</span>
              <span className="text-sm text-gray-500">{product.store}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Reviews: `}</span>
              <span className="text-sm text-gray-500">{product.rating}</span>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-500 font-semibold">{`Review: `}</span>
              <span className="text-sm text-gray-500">
                {product.reviews.length} review(s)
              </span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 w-1/3 overflow-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            encType="multipart/form-data"
          >
            <h2 className="text-2xl mb-4">
              {selectedProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <div>
              <label className="block mb-2">Name (UZ):</label>
              <input
                type="text"
                name="name.uz"
                value={formData.name.uz}
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Name (RU):</label>
              <input
                type="text"
                name="name.ru"
                value={formData.name.ru}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Description (UZ):</label>
              <textarea
                name="description.uz"
                value={formData.description.uz}
                required
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Description (RU):</label>
              <textarea
                name="description.ru"
                required
                value={formData.description.ru}
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Price:</label>
              <input
                type="text"
                required
                name="price"
                // value={formData.price}
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Count:</label>
              <input
                type="text"
                required
                name="count"
                // value={formData.count}
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2">Category:</label>
              <select
                required
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Category</option>

                {/* Male Categories */}
                <optgroup label="Male">
                  {categories
                    .filter((category) => category.gender.includes('male'))
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name?.uz}
                      </option>
                    ))}
                </optgroup>

                {/* Female Categories */}
                <optgroup label="Female">
                  {categories
                    .filter((category) => category.gender.includes('female'))
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name?.uz}
                      </option>
                    ))}
                </optgroup>

                {/* Kids Categories */}
                <optgroup label="Kids">
                  {categories
                    .filter((category) => category.gender.includes('kids'))
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name?.uz}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label className="block mb-2">Store:</label>
              <select
                required
                name="store_id"
                value={formData.store_id}
                onChange={handleChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>
                  Select Store
                </option>
                {store.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.name?.uz}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">Images:</label>
              <input
                type="file"
                required
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold">Selected Images:</h3>
              <div className="flex flex-wrap mt-2">
                {formData.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Selected ${index}`}
                    className="w-16 h-16 object-cover mr-2"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 dark:bg-gray-600 p-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 dark:bg-blue-600 text-white p-2 rounded"
              >
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;
