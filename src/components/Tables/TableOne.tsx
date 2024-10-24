import React, { useState } from 'react';
import axios from 'axios';

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
  onUpdateStore: (updatedStore: Store) => void; // Add the callback prop
  getData: (updatedStore: Store) => void; // Add the callback prop
}

const TableOne: React.FC<TableOneProps> = ({ storeData, onUpdateStore, getData }) => {
  const [isEditMode, setIsEditMode] = useState(false);
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
      getData()
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        const response = await axios.put(`https://surprize.uz/api/store/${editingStore._id}`, formData, {
          headers: {
            token: getToken(),
            'Content-Type': 'multipart/form-data',
          },
        });

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
      {!isEditMode ?
        (
<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
  <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Do'konlar</h4>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-200 dark:bg-gray-800">
        <tr>
          <th className="p-2 text-left text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Nomi</th>
          <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Telefon</th>
          <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Baholash</th>
          <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300 sm:table-cell">Manzil</th>
          <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300 sm:table-cell">Update</th>
          <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Delete</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {storeData.map((store) => (
          <tr key={store._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <td className="flex items-center gap-3 p-2 text-sm text-black dark:text-white whitespace-nowrap">
              <img src={store.image ? "https://surprize.uz" + store.image : null} alt="Store" className="w-8 h-8 rounded" />
              <span>{store.name?.uz}</span>
            </td>
            <td className="p-2 text-center text-black dark:text-white whitespace-nowrap">{store.phone}</td>
            <td className="p-2 text-center text-meta-3 whitespace-nowrap">{store.rating} ⭐</td>
            <td className="p-2 text-center text-black dark:text-white sm:table-cell whitespace-nowrap">{store.location}</td>
            <td className="p-2 text-center sm:table-cell whitespace-nowrap">
              <button className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400" onClick={() => handleUpdateClick(store)}>Update</button>
            </td>
            <td className="p-2 text-center whitespace-nowrap">
              <button className="text-sm font-medium text-red-600 hover:underline dark:text-red-400" onClick={() => handleDeleteClick(store._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        ) : (
          <form onSubmit={handleFormSubmit} className="p-5 bg-white rounded-md shadow-md">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Do'konni Yangilash</h4>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name.uz"
                value={editingStore?.name?.uz || ''}
                onChange={handleInputChange}
                placeholder="Nomi (uz)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="name.ru"
                value={editingStore?.name?.ru || ''}
                onChange={handleInputChange}
                placeholder="Nomi (ru)"
                className="p-2 border rounded-md"
              />
              <textarea
                name="description.uz"
                value={editingStore?.description?.uz || ''}
                onChange={handleInputChange}
                placeholder="Tavsif (uz)"
                className="p-2 border rounded-md"
              />
              <textarea
                name="description.ru"
                value={editingStore?.description?.ru || ''}
                onChange={handleInputChange}
                placeholder="Tavsif (ru)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="phone"
                value={editingStore?.phone || ''}
                onChange={handleInputChange}
                placeholder="Telefon"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="id_name"
                value={editingStore?.id_name || ''}
                onChange={handleInputChange}
                placeholder="ID Nomi"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="location"
                value={editingStore?.location || ''}
                onChange={handleInputChange}
                placeholder="Manzil"
                className="p-2 border rounded-md"
              />
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="p-2 border rounded-md"
              />
            </div>
            <button type="submit" className="mt-4 p-2 bg-blue-600 text-white rounded-md">
              Yangilash
            </button>
            <button type="button" onClick={() => setIsEditMode(false)} className="mt-4 p-2 bg-gray-400 text-white rounded-md">
              Bekor qilish
            </button>
          </form>
        )}
    </div>
  );
};

export default TableOne;
