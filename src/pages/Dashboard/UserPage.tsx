import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTable from '../../components/Users/UserTable';
import { useAuth } from '../Authentication/AuthContext';

interface User {
    _id?: string;
    name: string;
    phone: string;
    code?: string; // Tasdiqlash kodi optional bo'lishi kerak
    password: string;
    gender: 'male' | 'female';
    birthday: string; // Format: YYYY-MM-DD
}

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const { token } = useAuth();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [confirmationCode, setConfirmationCode] = useState<string>(''); // Tasdiqlash kodi
    const [isConfirmationSent, setIsConfirmationSent] = useState<boolean>(false); // Tasdiqlash yuborilganligini tekshirish

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://surprize.uz/api/users', {
                headers: { token },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleSaveUser = async (user: User) => {
        try {
            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('phone', user.phone);
            formData.append('password', user.password);
            formData.append('gender', user.gender);
            formData.append('birthday', user.birthday);

            // Birinchi POST so'rovi
            if (!isConfirmationSent) {
                const response = await axios.post('https://surprize.uz/api/users', formData, {
                    headers: { token, 'Content-Type': 'multipart/form-data' },
                });

                // Tasdiqlash kodini olish
                const confirmationCode = response.data.code;
                setConfirmationCode(confirmationCode); // Kodni saqlash
                setCurrentUser({ ...user, code: confirmationCode }); // Kodni qo'shish
                setIsConfirmationSent(true); // Tasdiqlash yuborilganligini belgilash
            } else {
                formData.append("code",confirmationCode)
                await axios.post('https://surprize.uz/api/users', formData, {
                    headers: { token },
                });

                setCurrentUser(undefined);
                setConfirmationCode(''); // Tasdiqlash kodini tozalash
                setIsConfirmationSent(false); // Tasdiqlash yuborilganligini tozalash
                setModalOpen(false);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await axios.delete(`https://surprize.uz/api/users/${id}`, {
                headers: { token },
            });
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    const handleEditUser = (user: User) => {
        setCurrentUser(user);
        setModalOpen(true);
        setIsConfirmationSent(false); // Tasdiqlash yuborilganligini tozalash
        setConfirmationCode(''); // Tasdiqlash kodini tozalash
    };

    const openModal = () => {
        setCurrentUser(undefined);
        setModalOpen(true);
        setIsConfirmationSent(false); // Tasdiqlash yuborilganligini tozalash
        setConfirmationCode(''); // Tasdiqlash kodini tozalash
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">User Management</h1>

            <button
                onClick={openModal}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Add User
            </button>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-4 rounded-lg w-1/3 shadow-lg">
                        <h2 className="text-xl mb-4 dark:text-white">
                            {currentUser ? 'Edit User' : 'Add User'}
                        </h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveUser(currentUser!);
                        }}>
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentUser?.name || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Phone:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={currentUser?.phone || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            {isConfirmationSent && (
                                <div className="mb-4">
                                    <label className="block mb-1 dark:text-gray-300">Confirmation Code:</label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={confirmationCode}
                                        onChange={(e) => setConfirmationCode(e.target.value)}
                                        className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                </div>
                            )}
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={currentUser?.password || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Gender:</label>
                                <select
                                    name="gender"
                                    value={currentUser?.gender || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, gender: e.target.value as 'male' | 'female' })}
                                    className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 dark:text-gray-300">Birthday:</label>
                                <input
                                    type="date"
                                    name="birthday"
                                    value={currentUser?.birthday || ''}
                                    onChange={(e) => setCurrentUser({ ...currentUser, birthday: e.target.value })}
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
                                    {isConfirmationSent ? 'Confirm User' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <UserTable
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
            />
        </div>
    );
};

export default UserPage;
