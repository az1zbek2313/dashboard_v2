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
        setError("Ma'lumotlarni olishda xatolik yuz berdi");
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

  console.log(56, userData);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  console.log(userData);

  return (
    <div
      className={`rounded-sm border  border-stroke bg-white pb-2.5 shadow-default`}
    >
      <section className="relative pt-32 pb-10">
        <img
          src="https://pagedone.io/asset/uploads/1705473378.png"
          alt="cover-image"
          className="w-full absolute top-0 left-0 z-0 h-52 object-cover"
        />
        <div className="w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
            <img
              src="https://pagedone.io/asset/uploads/1705471668.png"
              alt="user-avatar-image"
              className="border-4 border-solid border-white rounded-full object-cover"
            />
          </div>
          <div className="flex sm:flex-row max-sm:gap-5 items-start justify-between ">
            <div className="flex flex-col">
              <h3 className="font-manrope font-bold text-4xl text-gray-900 mb-1">
                {userData?.name}
              </h3>
              <p className="font-normal text-base leading-7 text-gray-500 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-geo-alt"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                </svg>
                <span>
                  {userData?.location[0] ? userData.location[0] : 'My location'}
                </span>
              </p>
            </div>
            <button className="rounded-full py-2 px-4 cursor-auto flex items-center group transition-all duration-500 bg-indigo-100 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-telephone text-indigo-600"
                viewBox="0 0 16 16"
              >
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
              </svg>
              <span className="px-2 font-medium text-base leading-7transition-all duration-500 text-indigo-600">
                Telefon: {userData?.phone}
              </span>
            </button>
            <button className="rounded-full py-2 px-4 cursor-auto flex items-center group transition-all duration-500 bg-indigo-100 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cake2 text-indigo-600"
                viewBox="0 0 16 16"
              >
                <path d="m3.494.013-.595.79A.747.747 0 0 0 3 1.814v2.683q-.224.051-.432.107c-.702.187-1.305.418-1.745.696C.408 5.56 0 5.954 0 6.5v7c0 .546.408.94.823 1.201.44.278 1.043.51 1.745.696C3.978 15.773 5.898 16 8 16s4.022-.227 5.432-.603c.701-.187 1.305-.418 1.745-.696.415-.261.823-.655.823-1.201v-7c0-.546-.408-.94-.823-1.201-.44-.278-1.043-.51-1.745-.696A12 12 0 0 0 13 4.496v-2.69a.747.747 0 0 0 .092-1.004l-.598-.79-.595.792A.747.747 0 0 0 12 1.813V4.3a22 22 0 0 0-2-.23V1.806a.747.747 0 0 0 .092-1.004l-.598-.79-.595.792A.747.747 0 0 0 9 1.813v2.204a29 29 0 0 0-2 0V1.806A.747.747 0 0 0 7.092.802l-.598-.79-.595.792A.747.747 0 0 0 6 1.813V4.07c-.71.05-1.383.129-2 .23V1.806A.747.747 0 0 0 4.092.802zm-.668 5.556L3 5.524v.967q.468.111 1 .201V5.315a21 21 0 0 1 2-.242v1.855q.488.036 1 .054V5.018a28 28 0 0 1 2 0v1.964q.512-.018 1-.054V5.073c.72.054 1.393.137 2 .242v1.377q.532-.09 1-.201v-.967l.175.045c.655.175 1.15.374 1.469.575.344.217.356.35.356.356s-.012.139-.356.356c-.319.2-.814.4-1.47.575C11.87 7.78 10.041 8 8 8c-2.04 0-3.87-.221-5.174-.569-.656-.175-1.151-.374-1.47-.575C1.012 6.639 1 6.506 1 6.5s.012-.139.356-.356c.319-.2.814-.4 1.47-.575M15 7.806v1.027l-.68.907a.94.94 0 0 1-1.17.276 1.94 1.94 0 0 0-2.236.363l-.348.348a1 1 0 0 1-1.307.092l-.06-.044a2 2 0 0 0-2.399 0l-.06.044a1 1 0 0 1-1.306-.092l-.35-.35a1.935 1.935 0 0 0-2.233-.362.935.935 0 0 1-1.168-.277L1 8.82V7.806c.42.232.956.428 1.568.591C3.978 8.773 5.898 9 8 9s4.022-.227 5.432-.603c.612-.163 1.149-.36 1.568-.591m0 2.679V13.5c0 .006-.012.139-.356.355-.319.202-.814.401-1.47.576C11.87 14.78 10.041 15 8 15c-2.04 0-3.87-.221-5.174-.569-.656-.175-1.151-.374-1.47-.575-.344-.217-.356-.35-.356-.356v-3.02a1.935 1.935 0 0 0 2.298.43.935.935 0 0 1 1.08.175l.348.349a2 2 0 0 0 2.615.185l.059-.044a1 1 0 0 1 1.2 0l.06.044a2 2 0 0 0 2.613-.185l.348-.348a.94.94 0 0 1 1.082-.175c.781.39 1.718.208 2.297-.426" />
              </svg>
              <span className="px-2 font-medium text-base leading-7 transition-all duration-500 text-indigo-600">
                Tug‘ilgan sana:{' '}
                {new Date(userData?.birthday).toLocaleDateString()}
              </span>
            </button>
          </div>
        </div>
      </section>

      <h5 className="text-lg px-12 font-semibold text-black">
        Buyurtmalar: {userData?.orders.length} ta
      </h5>
      <ul className="px-12">
        {userData?.orders.length ? (
          userData?.orders.map((orderId) => (
            <div
              key={orderId}
              className="flex flex-wrap items-center xs:gap-y-4 border-b-[1.5px] odd:bg-gray-2 border-gray-200 py-4 pb-4 dark:border-gray-700 md:py-5"
            >
              <dl className="w-full sm:w-1/2">
                <dt className="text-base font-medium text-gray-500">
                  Order ID:
                </dt>
                <dd className="mt-1.5 text-base font-semibold text-gray-900">
                  <a href="#" className="hover:underline">
                    #{orderId}
                  </a>
                </dd>
              </dl>

              <dl className="w-full xs:w-1/3 sm:w-1/4 md:flex-1 lg:w-auto">
                <dt className="text-base font-medium text-gray-500">
                  Date:
                </dt>
                <dd className="mt-1.5 text-base font-semibold text-gray-900">
                  10.11.2024
                </dd>
              </dl>

              <dl className="w-full xs:w-1/3 sm:w-1/5 md:flex-1 lg:w-auto">
                <dt className="text-base font-medium text-gray-500">
                  Price:
                </dt>
                <dd className="mt-1.5 text-base font-semibold text-gray-900">
                  $3,287
                </dd>
              </dl>

              <dl className="w-full xs:w-1/3 sm:w-1/4 sm:flex-1 lg:w-auto">
                <dt className="text-base font-medium text-gray-500">
                  Status:
                </dt>
                <dd className="mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                  <svg
                    className="me-1 h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 11.917 9.724 16.5 19 7.5"
                    ></path>
                  </svg>
                  Completed
                </dd>
              </dl>
            </div>
          ))
        ) : (
          <li className="text-gray-700 dark:text-gray-300">
            Buyurtmalar mavjud emas
          </li>
        )}
      </ul>
    </div>
  );
};

export default UserById;
