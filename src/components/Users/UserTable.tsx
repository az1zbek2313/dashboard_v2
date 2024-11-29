import React, { SetStateAction } from 'react';
import notfound from '../../images/notfound/notfound.png';
import { Link, useNavigate } from 'react-router-dom';

interface Location {
  name: string;
  location: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  favorite: string[];
  orders: string[];
  location: Location[];
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  openModal:React.Dispatch<SetStateAction<boolean>>
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onDelete,
  isLoading,
  openModal
}) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex mb-8 justify-between items-center">
        <h4 className=" text-3xl font-bold text-black/70">Foydalanuvchilar</h4>
        <button
                onClick={() => {openModal(true)}}
                className="bg-blue-500 text-white px-2 py-1 h-fit rounded"
            >
                Add User
            </button>
      </div>
      {!isLoading ? (
        <div className="overflow-x-auto">
          {users ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="border-b-[1.5px]">
                <tr>
                  <th className="p-2 text-left text-sm font-semibold uppercase text-black">
                    Nomi
                  </th>
                  <th className="p-2 text-start text-sm font-semibold uppercase text-black">
                    Phone
                  </th>
                  <th className="p-2 text-center text-sm font-semibold uppercase text-black sm:table-cell">
                    Favorite Count
                  </th>
                  <th className="p-2 text-center text-sm font-semibold uppercase text-black">
                    Order Count
                  </th>
                  <th className="p-2 text-center text-sm font-semibold uppercase text-black">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {users
                .sort((a, b) => b.orders.length - a.orders.length)
                .map((user) => (
                  <tr
                    key={user._id}
                    onClick={() => {navigate(`/userbyid/${user._id}`)}}
                    className="hover:bg-blue-50 cursor-pointer odd:bg-white even:bg-gray-50"
                  >
                    <td className="p-2 font-medium text-left text-sm text-gray-700 dark:text-gray-300">
                      {user.name}
                    </td>
                    <td className="p-2 text-start text-sm text-gray-700 dark:text-gray-300">
                      {user.phone}
                    </td>
                    <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">
                      {user.favorite.length}
                    </td>
                    <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">
                      {user.orders.length}
                    </td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user._id);
                      }}
                      className="p-2 text-center whitespace-nowrap"
                    >
                      <button className="text-sm font-medium hover:underline text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          color='red'
                          className="bi bi-trash3-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      </button>
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
  );
};

export default UserTable;
