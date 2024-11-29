import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableOne from '../../components/Tables/TableOne';
import defaultImage from '../../images/Logotip/SVG/icon.svg';

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

const ECommerce: React.FC = () => {
  const [storeData, setStoreData] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getToken = () => localStorage.getItem('token');
  const fetchStoreData = async () => {
    try {
      const response = await axios.get('https://surprize.uz/api/store', {
        headers: { token: getToken() },
      });
      setStoreData(response.data);
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  };
  useEffect(() => {
    setIsLoading(true)
    fetchStoreData();
  }, []);

  const handleUpdateStore = (updatedStore: Store) => {
    setStoreData((prevStoreData) =>
      prevStoreData.map((store) =>
        store._id === updatedStore._id ? updatedStore : store,
      ),
    );
  };

  return (
    <div>
      <TableOne isLoading={isLoading} storeData={storeData} onUpdateStore={handleUpdateStore} getData={fetchStoreData} />
    </div>
  );
};

export default ECommerce;
