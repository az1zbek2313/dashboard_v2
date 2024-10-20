import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

    useEffect(() => {
        axios.get(`https://surprize.uz/api/category/${id}`)
            .then((response) => {
                setProducts(response.data.products);
                // console.log('response.data :', response.data);
            })
            .catch((error) => console.error(error));
    }, [id]);
    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Products in Category</h1>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <table className="w-full table-auto">
                    <thead className="bg-gray-2 dark:bg-meta-4">
                        <tr>
                            <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Product Name (UZ)</th>
                            <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Price</th>
                            <th className="p-2.5 xl:p-5 text-left text-sm font-medium uppercase xsm:text-base">Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (

                            <tr key={product._id}>
                                <td className="p-2.5 xl:p-5 text-sm">{product.name.uz}</td>
                                <td className="p-2.5 xl:p-5 text-sm">{product.price}</td>
                                <td className="p-2.5 xl:p-5 text-sm">
                                    <img src={`https://surprize.uz${product.images[0]}`} alt={product.name.uz} className="w-12 h-12" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryProducts;
