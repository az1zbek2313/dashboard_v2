import React, { SetStateAction, useEffect, useState } from 'react';
import notfound from '../../images/notfound/notfound.png';

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
  isLoading: boolean;
  openModal: React.Dispatch<SetStateAction<boolean>>;
}

const AdminTable: React.FC<AdminTableProps> = ({
  admins,
  onEdit,
  onDelete,
  isLoading,
  openModal,
}) => {
  const [isAction, setIsAction] = useState('');
  const [selectAdmins, setSelectAdmins] = useState(admins);

  function handleSelect(value:string) {
   if (value == "all") {
    setSelectAdmins(admins);
   } else {
    const filtered = admins.filter(items => items.role === value);
    setSelectAdmins(filtered);
   }
    
  }

  useEffect(() => {
    setSelectAdmins(admins)
  }, [admins])

  return (
    <div
      onClick={(e) => {
        if (e.target == e.currentTarget) {
          setIsAction('');
        }
      }}
      className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1"
    >
      <div className="flex mb-6 justify-between items-center">
        <h4 className="text-3xl font-bold text-black/70">Adminlar</h4>
        <div className="flex gap-2 items-center">
        <form className="">
            <select
              id="countries"
              onChange={e => handleSelect(e.target.value)}
              className="focus:outline-none cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="all" selected>All admins</option>
              <option value="store_admin">Store admins</option>
              <option value="admin">Main admins</option>
            </select>
          </form>
          <button
            onClick={() => {
              openModal(true);
            }}
            className="bg-blue-500 text-white px-2 py-2 h-fit rounded-lg"
          >
            Add User
          </button>
        </div>
      </div>
      {!isLoading ? (
        <div className="overflow-x-auto">
          {selectAdmins ? (
            <table className="min-w-full divide-y">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="p-2 text-left text-sm font-semibold uppercase text-gray-700">
                    Name
                  </th>
                  <th className="p-2 text-left text-sm font-semibold uppercase text-gray-700">
                    Phone
                  </th>
                  <th className="p-2 text-left text-sm font-semibold uppercase text-gray-700">
                    Role
                  </th>
                  <th className="p-2 text-center text-sm font-semibold uppercase text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {selectAdmins.map((admin) => (
                  <tr
                    onMouseLeave={() => {
                      setIsAction('');
                    }}
                    key={admin._id}
                    className="border-b border-gray-300 odd:bg-white even:bg-blue-50"
                  >
                    <td className="p-2 text-left font-medium text-gray-700">
                      {admin.name}
                    </td>
                    <td className="p-2 text-left text-sm text-gray-700">
                      {admin.phone}
                    </td>
                    <td className="p-2 text-left text-sm text-gray-700">
                      {admin.role}
                    </td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAction(admin._id);
                      }}
                      className="p-2 text-center whitespace-nowrap"
                    >
                      <button className="text-lg font-medium hover:underline text-blue-600">
                        ...
                      </button>
                    </td>
                    {isAction == admin._id && (
                      <ul className="absolute scale-110 right-18 border-[1.5px] rounded-md flex flex-col bg-white z-[10000]">
                        <li className="text-start py-[.5px] px-2 hover:bg-blue-50 sm:table-cell whitespace-nowrap">
                          <button
                            className="text-sm font-medium text-blue-600 hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(admin);
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
                              onDelete(admin._id);
                              setIsAction('');
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
  );
};

export default AdminTable;
