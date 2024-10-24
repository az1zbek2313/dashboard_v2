import React from 'react';

interface Admin {
  _id: string;
  name: string;
  phone: string;
  age: number;
  role: string; // Ensure this is a string
}

interface AdminTableProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (id: string) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ admins, onEdit, onDelete }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">Admins</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Name</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Phone</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Age</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Role</th>
              <th className="p-2 text-center text-sm font-medium uppercase text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900">
            {admins.map((admin) => (
              <tr key={admin._id} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2 text-left text-sm text-gray-700 dark:text-gray-300">{admin.name}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">{admin.phone}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">{admin.age}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">{admin.role}</td>
                <td className="p-2 text-center text-sm text-gray-700 dark:text-gray-300">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => onEdit(admin)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => onDelete(admin._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
