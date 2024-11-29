import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Authentication/AuthContext';

interface Product {
    name: {
        uz: string;
        ru: string;
    };
    description: {
        uz: string;
        ru: string;
    };
    reviews: any[];
    rating: number;
    _id: string;
    price: number;
    images: string[];
    count: number;
    id_name: string;
    __v: number;
}

interface Category {
    name: {
        uz: string;
        ru: string;
    };
    _id: string;
    products: string[];
    __v: number;
}

const StoreProduct: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const { store_id, token } = useAuth();


    const [formData, setFormData] = useState<any>({
        name: { uz: '', ru: '' },
        description: { uz: '', ru: '' },
        price: 0,
        count: 0,
        images: [],
        category_id: '',
        // store_id:""
    });
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`https://surprize.uz/api/store/${store_id}`);
            setProducts(response.data.products);
            console.log('response.data s:', response.data.products);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {


        const fetchCategories = async () => {
            try {
                const response = await axios.get('https://surprize.uz/api/sub-category');
                setCategories(response.data);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "price" || name === "count") {
            setFormData((prevData: any) => ({ ...prevData, [name]: Number(value) }));
        } else if (name === "category_id") {
            setFormData((prevData: any) => ({ ...prevData, category_id: value }));
        } else if (name === "store_id") {
            setFormData((prevData: any) => ({ ...prevData, store_id: value }));
        } else {
            const [key, lang] = name.split('.');
            setFormData((prevData: any) => ({
                ...prevData,
                [key]: {
                    ...prevData[key],
                    [lang]: value,
                },
            }));
        }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files); // Fayllarni massivga aylantirish
        if (files.length > 0) {
            setUploadedFiles(files);
        }
    };


    const createImageUrls = (files: File[]): string[] => {
        return files.map((file) => URL.createObjectURL(file));
    };

    const appendImages = (newImages: string[]) => {
        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...newImages],
        }));
    };
    const openModal = (product?: Product) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: { uz: product.name?.uz, ru: product.name.ru },
                description: { uz: product.description?.uz, ru: product.description.ru },
                price: product.price,
                count: product.count,
                images: product.images,
                category_id: product.category_id, // Assuming product has category_id
                store_id: store_id // Assuming product has category_id
            });
        } else {
            setFormData({
                name: { uz: '', ru: '' },
                description: { uz: '', ru: '' },
                price: 0,
                count: 0,
                images: [],
                category_id: '',
                // store_id: ''
            });
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name_uz', formData.name?.uz);
        data.append('name_ru', formData.name?.ru);
        data.append('description_uz', formData.description?.uz);
        data.append('description_ru', formData.description?.ru);
        data.append('price', formData.price.toString());
        data.append('count', formData.count.toString());
        data.append('category_id', formData.category_id); // Append selected category ID
        data.append('store_id', store_id); // Append selected store ID
        uploadedFiles.forEach((file) => {
            data.append('images', file); // Har bir faylni alohida qo'shish
        });
        for (let pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        try {
            if (selectedProduct) {
                console.log("Updating product...");

                const response = await axios.put(`https://surprize.uz/api/product/${selectedProduct._id}`, data, {
                    headers: {
                        token,
                        'Content-Type': 'multipart/form-data',
                    }
                });

                console.log("Response:", response.data); // Qaytgan ma'lumotni konsolga chiqarish
            } else {
                console.log("Adding new product...");

                const response = await axios.post('https://surprize.uz/api/product', data, {
                    headers: {
                        token,
                        'Content-Type': 'multipart/form-data',
                    }
                });

                console.log("Response:", response.data); // Qaytgan ma'lumotni konsolga chiqarish
            }
            fetchProducts();
            closeModal();
        } catch (error) {
            console.error("Error occurred:", error); // Xato haqida ma'lumotni konsolga chiqarish
            setError('Error occurred while saving product');
        }

    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`https://surprize.uz/api/product/${id}`, {
                headers: { 'Content-Type': 'application/json', token }
            });
            fetchProducts();
        } catch (error) {
            setError('Error occurred while deleting product');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <button onClick={() => openModal()} className="bg-blue-500 text-white p-2 rounded">
                Add Product
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {products.map((product) => (
                    <div key={product._id} className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
                        <h2 className="text-xl font-semibold">{product.name?.uz}</h2>
                        <p className="text-gray-600">{product.description?.uz}</p>
                        <p className="text-lg font-bold">{`Price: $${product.price}`}</p>
                        {product.images?.length > 0 && (
                            <img
                                src={'https://surprize.uz' + product.images[0]}
                                alt={product.name?.uz}
                                className="w-full h-64 rounded mt-2 object-cover"
                            />
                        )}

                        <div className="mt-2">
                            <span className="text-sm text-gray-500">{`Available Count: ${product.count}`}</span>
                        </div>
                        <button onClick={() => openModal(product)} className="bg-yellow-500 text-white p-1 rounded mt-2 mr-1">
                            Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white p-1 rounded mt-2">
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 w-1/3 overflow-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                        encType="multipart/form-data"
                    >
                        <h2 className="text-2xl mb-4">{selectedProduct ? 'Edit Product' : 'Add Product'}</h2>
                        <div>
                            <label className="block mb-2">Name (UZ):</label>
                            <input
                                type="text"
                                name="name.uz"
                                value={formData.name?.uz}
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                                required

                            />
                        </div>
                        <div>
                            <label className="block mb-2">Name (RU):</label>
                            <input
                                type="text"
                                name="name.ru"
                                value={formData.name.ru}
                                onChange={handleChange}
                                required
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Description (UZ):</label>
                            <textarea
                                name="description.uz"
                                value={formData.description?.uz}
                                required
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Description (RU):</label>
                            <textarea
                                name="description.ru"
                                required
                                value={formData.description.ru}
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Price:</label>
                            <input
                                type="text"
                                required
                                name="price"
                                // value={formData.price}
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Count:</label>
                            <input
                                type="text"
                                required
                                name="count"
                                // value={formData.count}
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            />
                        </div>



                        <div>
                            <label className="block mb-2">Category:</label>
                            <select
                                required
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select Category</option>

                                {/* Male Categories */}
                                <optgroup label="Male">
                                    {categories
                                        .filter(category => category.gender.includes("male"))
                                        .map(category => (
                                            <option key={category._id} value={category._id}>
                                                {category.name?.uz}
                                            </option>
                                        ))}
                                </optgroup>

                                {/* Female Categories */}
                                <optgroup label="Female">
                                    {categories
                                        .filter(category => category.gender.includes("female"))
                                        .map(category => (
                                            <option key={category._id} value={category._id}>
                                                {category.name?.uz}
                                            </option>
                                        ))}
                                </optgroup>

                                {/* Kids Categories */}
                                <optgroup label="Kids">
                                    {categories
                                        .filter(category => category.gender.includes("kids"))
                                        .map(category => (
                                            <option key={category._id} value={category._id}>
                                                {category.name?.uz}
                                            </option>
                                        ))}
                                </optgroup>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2">Images:</label>
                            <input
                                type="file"
                                required
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mt-2">
                            <h3 className="text-lg font-semibold">Selected Images:</h3>
                            <div className="flex flex-wrap mt-2">
                                {formData.images.map((image: string, index: number) => (
                                    <img key={index} src={image} alt={`Selected ${index}`} className="w-16 h-16 object-cover mr-2" />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" onClick={closeModal} className="bg-gray-300 dark:bg-gray-600 p-2 rounded mr-2">
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 dark:bg-blue-600 text-white p-2 rounded">
                                {selectedProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StoreProduct;




                        {/* <div>
                            <label className="block mb-2">Category:</label>
                            <select
                                required
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name?.uz}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                        {/* <div>
                            <label className="block mb-2">Store:</label>
                            <select
                                required
                                name="store_id"
                                value={formData.store_id}
                                onChange={handleChange}
                                className="border rounded p-2 w-full dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select Store</option>
                                {store.map(store => (
                                    <option key={store._id} value={store._id}>
                                        {store.name?.uz}
                                    </option>
                                ))}
                            </select>
                        </div> */}