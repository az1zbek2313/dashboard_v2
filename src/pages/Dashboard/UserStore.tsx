import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';
import UserStoreAdmin from '../../components/Tables/UserStoreTable';

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
}

const UserStore: React.FC = () => {
  const [storeData, setStoreData] = useState<Store[]>([]);
  const { store_id, token } = useAuth();

  const fetchStoreData = async () => {
    try {
      const response = await axios.get(`https://surprize.uz/api/store/${store_id}`, {
        headers: { token },
      });
      setStoreData([response.data]);
      console.log(32, storeData);
      
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  };
  useEffect(() => {
    fetchStoreData();
  }, []);

  const handleUpdateStore = (updatedStore: Store) => {
    setStoreData((prevStoreData) =>
      prevStoreData.map((store) => (store._id === updatedStore._id ? updatedStore : store))
    );
  };

  return (
    <div>
      <UserStoreAdmin storeData={storeData} onUpdateStore={handleUpdateStore} getData={fetchStoreData} />
    </div>
  );
};

export default UserStore;
