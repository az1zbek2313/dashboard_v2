import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';
import AdminTable from '../../components/Users/AdminTable';

interface Admin {
    _id?: string;
    name: string;
    age: number;
    role: string; // Adminning roli
    contract: string; // Shartnoma IDsi
    phone: string;
    password: string;
}

const UserAdminPage: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [currentAdmin, setCurrentAdmin] = useState<Admin | undefined>(undefined);
    const { token } = useAuth();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('https://surprize.uz/api/admin', {
                headers: { token },
            });
            setAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, [token]);

    const handleSaveAdmin = async (admin: Admin) => {
        try {
            const adminData = {
                name: admin.name,
                role: admin.role,
                phone: admin.phone,
                password: admin.password,
            };
    
            if (admin._id) {
                // Agar admin ID mavjud bo'lsa, yangilash uchun PUT metodini ishlatamiz
                await axios.put(`https://surprize.uz/api/admin/${admin._id}`, adminData, {
                    headers: { token, 'Content-Type': 'application/json' }, // PUT requestda yuborish
                });
            } else {
                // Agar admin ID mavjud bo'lmasa, yangi admin qo'shish uchun POST metodini ishlatamiz
                await axios.post('https://surprize.uz/api/admin', adminData, {
                    headers: { token, 'Content-Type': 'application/json' }, // POST requestda yuborish
                });
            }
    
            setCurrentAdmin(undefined);
            setModalOpen(false);
            fetchAdmins(); // Yangilangan adminlar ro'yxatini olish
        } catch (error) {
            console.error('Error saving admin:', error);
        }
    };
    

    const handleDeleteAdmin = async (id: string) => {
        try {
            await axios.delete(`https://surprize.uz/api/admin/${id}`, {
                headers: { token },
            });
            setAdmins((prev) => prev.filter((admin) => admin._id !== id));
        } catch (error) {
            console.error('Error deleting admin:', error);
        }
    };

    const handleEditAdmin = (admin: Admin) => {
        setCurrentAdmin(admin);
        setModalOpen(true);
    };

    const openModal = () => {
        setCurrentAdmin(undefined);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Admin Management</h1>

            <button
                onClick={openModal}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Add Admin
            </button>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-4 rounded-lg w-1/3 shadow-lg">
                        <h2 className="text-xl mb-4 dark:text-white">
                            {currentAdmin ? 'Edit Admin' : 'Add Admin'}
                        </h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveAdmin(currentAdmin!);
                        }}>
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentAdmin?.name || ''}
                                    onChange={(e) => setCurrentAdmin({ ...currentAdmin, name: e.target.value })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Role:</label>
                                <select
                                    name="role"
                                    value={currentAdmin?.role || ''}
                                    onChange={(e) => setCurrentAdmin({ ...currentAdmin, role: e.target.value })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="" disabled>Select role</option>
                                    <option value="admin">Admin</option>
                                    <option value="store_admin">Store Admin</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={currentAdmin?.phone || ''}
                                    onChange={(e) => setCurrentAdmin({ ...currentAdmin, phone: e.target.value })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={currentAdmin?.password || ''}
                                    onChange={(e) => setCurrentAdmin({ ...currentAdmin, password: e.target.value })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 dark:bg-gray-700 dark:text-gray-200 p-2 rounded mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 dark:bg-blue-600 text-white p-2 rounded"
                                >
                                    {currentAdmin ? 'Update Admin' : 'Add Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AdminTable
                admins={admins}
                onEdit={handleEditAdmin}
                onDelete={handleDeleteAdmin}
            />
        </div>
    );
};

export default UserAdminPage;
