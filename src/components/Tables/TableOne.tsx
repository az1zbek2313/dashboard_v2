import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import defaultImage from '../../images/Logotip/SVG/icon.svg';
import notfound from '../../images/notfound/notfound.png';

interface Store {
  _id: string;
  name: {
    uz: string;
    ru: string;
  };
  description: {
    uz: string;
    ru: string;
  };
  phone: string;
  id_name: string;
  location: string;
  image: string;
}

interface TableOneProps {
  storeData: Store[];
  onUpdateStore: (updatedStore: Store) => void;
  getData: (updatedStore: Store) => void;
  isLoading: boolean;
}

const TableOne: React.FC<TableOneProps> = ({
  storeData,
  onUpdateStore,
  getData,
  isLoading,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAction, setIsAction] = useState('');
  const navigate = useNavigate();
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const getToken = () => localStorage.getItem('token');

  const handleUpdateClick = (store: Store) => {
    setEditingStore(store);
    setIsEditMode(true);
  };
  const handleDeleteClick = async (storeId: string) => {
    try {
      await axios.delete(`https://surprize.uz/api/store/${storeId}`, {
        headers: {
          token: getToken(),
        },
      });

      // Do'koni ro'yxatdan olib tashlash
      getData();
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (editingStore) {
      const { name, value } = e.target;
      const keyParts = name.split('.');
      if (keyParts.length > 1) {
        setEditingStore({
          ...editingStore,
          [keyParts[0]]: {
            ...editingStore[keyParts[0]],
            [keyParts[1]]: value,
          },
        });
      } else {
        setEditingStore({
          ...editingStore,
          [name]: value,
        });
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingStore) {
      const formData = new FormData();
      formData.append('name_uz', editingStore.name?.uz || '');
      formData.append('name_ru', editingStore.name?.ru || '');
      formData.append('description_uz', editingStore.description?.uz || '');
      formData.append('description_ru', editingStore.description?.ru || '');
      formData.append('phone', editingStore.phone || '');
      formData.append('id_name', editingStore.id_name || '');
      formData.append('location', editingStore.location || '');
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      try {
        const response = await axios.put(
          `https://surprize.uz/api/store/${editingStore._id}`,
          formData,
          {
            headers: {
              token: getToken(),
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        // Call the callback to update the store in the parent component
        onUpdateStore(response.data);
        setIsEditMode(false);
      } catch (error) {
        console.error('Error updating store:', error);
      }
    }
  };

  return (
    <div>
      {!isEditMode ? (
        <div
          onClick={(e) => {
            if (e.target == e.currentTarget) {
              setIsAction('');
            }
          }}
          className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
        >
          <h4 className="mb-6 text-3xl font-bold text-black/70">Do'konlar</h4>
          {!isLoading ? (
            <div className="overflow-x-auto">
              {storeData ? (
                <table className="min-w-full divide-y">
                  <thead className="border-b-[1.5px]">
                    <tr>
                      <th className="p-2 text-left text-sm font-semibold uppercase text-black">
                        Nomi
                      </th>
                      <th className="p-2 text-start text-sm font-semibold uppercase text-black">
                        Telefon
                      </th>
                      <th className="p-2 text-start text-sm font-semibold uppercase text-black sm:table-cell">
                        Manzil
                      </th>
                      <th className="p-2 text-center text-sm font-semibold uppercase text-black">
                        Baholash
                      </th>
                      <th className="p-2 text-center text-sm font-semibold uppercase text-black">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                    {storeData.map((store) => (
                      <tr
                        onMouseLeave={() => {
                          setIsAction('');
                        }}
                        onClick={() => {
                          navigate(`/storeid/{${store._id}}`);
                        }}
                        key={store._id}
                        className="hover:bg-blue-50 cursor-pointer odd:bg-white even:bg-gray-50"
                      >
                        <td className="flex items-center gap-3 p-2 text-sm text-black whitespace-nowrap">
                          <img
                            src={
                              store.image
                                ? 'https://surprize.uz' + store.image
                                : defaultImage
                            }
                            alt="Store"
                            className="w-8 h-8 lg:w-9 lg:h-9 rounded-full"
                          />
                          <h3 className="font-medium text-base">
                            {store.name?.uz}
                          </h3>
                        </td>
                        <td className="p-2 text-start text-black whitespace-nowrap">
                          {store.phone}
                        </td>
                        <td className="p-2 text-start text-black sm:table-cell whitespace-nowrap">
                          {store.location}
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          {store.rating}⭐
                        </td>
                        <td
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsAction(store._id);
                          }}
                          className="p-2 text-center whitespace-nowrap"
                        >
                          <button className="text-sm font-medium hover:underline text-blue-600">
                            ...
                          </button>
                        </td>
                        {isAction == store._id && (
                          <ul className="absolute scale-110 right-18 border-[1.5px] rounded-md flex flex-col bg-white z-[10000]">
                            <li className="text-start py-[.5px] px-2 hover:bg-blue-50 sm:table-cell whitespace-nowrap">
                              <button
                                className="text-sm font-medium text-blue-600 hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateClick(store);
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
                                  handleDeleteClick(store._id);
                                }}
                              >
                                Delete
                              </button>
                            </li>
                          </ul>
                        )}
                      </tr>
                    ))}
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
      ) : (
        <form
          onSubmit={handleFormSubmit}
          className="p-5 bg-white dark:bg-gray-800 rounded-md shadow-md"
        >
          <h4 className="mb-6 text-xl font-semibold text-black">
            Do'konni Yangilash
          </h4>

          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name.uz"
              value={editingStore?.name?.uz || ''}
              onChange={handleInputChange}
              placeholder="Nomi (uz)"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
            <input
              type="text"
              name="name.ru"
              value={editingStore?.name?.ru || ''}
              onChange={handleInputChange}
              placeholder="Nomi (ru)"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
            <textarea
              name="description.uz"
              value={editingStore?.description?.uz || ''}
              onChange={handleInputChange}
              placeholder="Tavsif (uz)"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
            <textarea
              name="description.ru"
              value={editingStore?.description?.ru || ''}
              onChange={handleInputChange}
              placeholder="Tavsif (ru)"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
            <input
              type="text"
              name="phone"
              value={editingStore?.phone || ''}
              onChange={handleInputChange}
              placeholder="Telefon"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
            <input
              type="text"
              name="id_name"
              value={editingStore?.id_name || ''}
              onChange={handleInputChange}
              placeholder="ID Nomi"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
            <input
              type="text"
              name="location"
              value={editingStore?.location || ''}
              onChange={handleInputChange}
              placeholder="Manzil"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="p-2 border rounded-md dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="mt-4 p-2 bg-blue-600 text-white rounded-md"
          >
            Yangilash
          </button>
          <button
            type="button"
            onClick={() => setIsEditMode(false)}
            className="mt-4 p-2 bg-gray-400 text-white rounded-md"
          >
            Bekor qilish
          </button>
        </form>
      )}
    </div>
  );
};

export default TableOne;
