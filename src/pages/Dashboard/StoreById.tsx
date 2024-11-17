import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  products: {
    _id: string;
    name: {
      uz: string;
      ru: string;
    };
    description: {
      uz: string;
      ru: string;
    };
    price: number;
    images: string[];
    rating: number;
  }[];
}

const StoreById: React.FC = () => {
  let { id } = useParams<{ id: string }>(); // ID param dan olinadi
id=decodeURIComponent(id).replace(/[{}]/g, ''); 
  const [storeData, setStoreData] = useState<Store | null>(null);
  console.log('storeData :', storeData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      const url = `https://surprize.uz/api/store/${id}`; // API endpoint

      try {
        const response = await axios.get(url);
        setStoreData(response.data); // Javobni statega saqlash
        setLoading(false);
      } catch (err) {
        setError('Ma\'lumotlarni olishda xatolik yuz berdi');
        setLoading(false);
      }
    };

    fetchStoreData(); // Ma'lumotlarni olish uchun chaqiriladi
  }, [id]);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        {storeData?.name.uz} Do'koni
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Mahsulot nomi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Narx
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Tavsif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Reyting
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {storeData?.products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {product.name.uz}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {product.price} so'm
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {product.description.uz}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {product.rating}/5
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreById;
