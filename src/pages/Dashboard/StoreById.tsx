import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
  products?: {
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
  id = decodeURIComponent(id).replace(/[{}]/g, '');
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
        setError("Ma'lumotlarni olishda xatolik yuz berdi");
        setLoading(false);
      }
    };

    fetchStoreData(); // Ma'lumotlarni olish uchun chaqiriladi
  }, [id]);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        {storeData?.name.uz} Do'koni
      </h4>
      <div className="overflow-x-auto">
        {storeData?.products?.length ?? 0 > 0 ? (
          <table className="min-w-full divide-y">
            <thead className="border-b-[1.5px]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase">
                  Mahsulot nomi
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase">
                  Narx
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase">
                  Tavsif
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase">
                  Reyting
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y-[1.5px] ">
              {storeData?.products.map((product) => (
                <tr className="odd:bg-white even:bg-gray-50" key={product._id}>
                  <td className="px-6 py-4 text-gray-900">{product.name.uz}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.price} so'm
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.description.uz}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {product.rating}/5
                  </td>
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
    </div>
  );
};

export default StoreById;
