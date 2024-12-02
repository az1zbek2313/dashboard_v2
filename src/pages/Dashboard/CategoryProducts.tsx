import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import notfound from '../../images/notfound/notfound.png';

interface Product {
  name: {
    uz: string;
    ru: string;
  };
  _id: string;
  price: number;
  images: string[];
}

const CategoryProducts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('Products in Category');

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`https://surprize.uz/api/category/${id}`)
      .then((response) => {
        setProducts(response.data.products);
        setCategoryName(response.data.name.uz);
        setIsLoading(false);

        // console.log('response.data :', response.data);
      })
      .catch((error) => console.error(error));
  }, [id]);
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 sm:px-7.5 xl:pb-1">
      {!isLoading ? (
        <>
          <h1 className="text-3xl font-bold mb-6 text-black/70">
            {categoryName}
          </h1>
          <div className="border-stroke bg-white">
           {
            products.length > 0 ?
            <table className="w-full table-auto">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-medium text-black uppercase xsm:text-base">
                  Images
                </th>
                <th className="px-3 py-3 text-left text-sm font-medium text-black uppercase xsm:text-base">
                  Product Name (UZ)
                </th>
                <th className="px-3 py-3 text-left text-sm font-medium text-black uppercase xsm:text-base">
                  Price
                </th>
                <th className="px-3 py-3 text-center text-sm font-medium text-black uppercase xsm:text-base">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className=" odd:bg-white even:bg-blue-50"
                >
                  <td className="p-2 text-sm">
                    <img
                      src={`https://surprize.uz${product.images[0]}`}
                      alt={product.name.uz}
                      className="w-16 h-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-3 text-black/70 font-medium">
                    {product.name.uz}
                  </td>
                  <td className="p-3 text-black/70 font-medium">{`$${product.price}.00`}</td>
                  <td className="p-3 text-black/70 font-medium text-center">{`${product.rating} ⭐`}</td>
                </tr>
              ))}
            </tbody>
          </table> :
          (
            <div className="min-h-[50vh] w-full sm:h-[60vh] lg:min-h-[70vh] flex justify-center items-center">
              <div className="flex flex-col gap-2 md:gap-4 justify-center items-center">
                <div className="w-full flex justify-center">
                  <img src={notfound} alt="search box icon" className="" />
                </div>
              </div>
            </div>
          )
           }
          </div>
        </>
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

export default CategoryProducts;
