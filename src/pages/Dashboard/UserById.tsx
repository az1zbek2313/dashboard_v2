import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  phone: string;
  birthday: string;
  gender: string;
  favorite: string[];
  orders: string[];
  location: string[];
  createdAt: string;
  updatedAt: string;
}

const UserById: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL'dan id olish
  const cleanId = decodeURIComponent(id).replace(/[{}]/g, ''); // ID ni tozalash
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false); // Dark mode o'zgaruvchisi

  useEffect(() => {
    // Ma'lumotlarni olish funksiyasi
    const fetchUserData = async () => {
      const url = `https://surprize.uz/api/users/${cleanId}`; // API endpoint

      try {
        const response = await axios.get(url);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Ma\'lumotlarni olishda xatolik yuz berdi');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [cleanId]);

  // Dark mode o'zgartirish
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString()); // Dark mode holatini saqlash
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className={`rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default ${darkMode ? 'dark:border-strokedark dark:bg-boxdark' : ''} sm:px-7.5 xl:pb-1`}>
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">User: {userData?.name}</h4>
      <p className="text-gray-700 dark:text-gray-300">Telefon: {userData?.phone}</p>
      <p className="text-gray-700 dark:text-gray-300">Tug‘ilgan sana: {new Date(userData?.birthday).toLocaleDateString()}</p>
      <p className="text-gray-700 dark:text-gray-300">Jins: {userData?.gender}</p>
      
      <h5 className="mt-4 text-lg font-semibold text-black dark:text-white">Buyurtmalar:</h5>
      <ul>
        {userData?.orders.length ? (
          userData?.orders.map((orderId) => <li key={orderId} className="text-gray-700 dark:text-gray-300">Buyurtma ID: {orderId}</li>)
        ) : (
          <li className="text-gray-700 dark:text-gray-300">Buyurtmalar mavjud emas</li>
        )}
      </ul>
    </div>
  );
};

export default UserById;
