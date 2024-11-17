import React from 'react';
import { Link } from 'react-router-dom';

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
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Users</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Name</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Phone</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Favorite Count</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Order Count</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900">
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2 text-left text-sm text-gray-700 dark:text-gray-300">{user.name}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">{user.phone}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">{user.favorite.length}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">{user.orders.length}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">

                  <button
                    className="text-red-600 hover:underline mr-2 dark:text-red-400"
                    onClick={() => onDelete(user._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/userbyid/${user._id}`}>
                  <button
                    className="text-sm font-medium green-red-600 hover:underline dark:text-green-400"
                  >
                    View
                  </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
