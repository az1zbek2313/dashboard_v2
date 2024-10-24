import React, { useState, useEffect } from 'react';

interface User {
  _id?: string;
  name: string;
  phone: string;
}

interface UserFormProps {
  user?: User;
  onSave: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState<User>({
    name: '',
    phone: '',
    _id: user?._id,
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: '', phone: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-2">
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Save
      </button>
    </form>
  );
};

export default UserForm;
