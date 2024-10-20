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
}

const TableOne: React.FC<TableOneProps> = ({ storeData, onUpdateStore }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const getToken = () => localStorage.getItem('token');

  const handleUpdateClick = (store: Store) => {
    setEditingStore(store);
    setIsEditMode(true);
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
      {!isEditMode ? (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Do'konlar</h4>

          <div className="flex flex-col">
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Nomi</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Telefon</h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Baholash</h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Manzil</h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">Update</h5>
              </div>
            </div>

            {storeData.map((store) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 border-b border-stroke dark:border-strokedark`}
                key={store._id}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <div className="flex-shrink-0">
                    <img src={store.image ? "https://surprize.uz" + store.image : null} alt="Store" width={30} height={30} />
                  </div>
                  <p className="hidden text-black dark:text-white sm:block">{store.name.uz}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{store.phone}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{store.rating} ⭐</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">{store.location}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <button
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                    onClick={() => handleUpdateClick(store)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
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
