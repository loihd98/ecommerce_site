'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { Category } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function NewProductPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDesc: '',
        adminNote: '',
        price: '',
        comparePrice: '',
        sku: '',
        categoryId: '',
        stock: '',
        colors: [] as string[],
        sizes: [] as string[],
        affiliateLink: '',
        isActive: true,
        isFeatured: false,
        images: [] as string[],
    });
    const [colorInput, setColorInput] = useState('');
    const [sizeInput, setSizeInput] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchCategories();
    }, [isAuthenticated, user, router]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            const categoriesData = response.data.data || response.data || [];
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/admin/products', {
                ...formData,
                price: parseFloat(formData.price),
                comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
                stock: parseInt(formData.stock),
            });
            alert('Product created successfully!');
            router.push('/admin/products');
        } catch (error: any) {
            console.error('Failed to create product:', error);
            alert(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await api.post('/media/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Extract path from response (should be like /uploads/images/file.jpg)
            let imagePath = response.data.data?.path || response.data.data?.url;

            // If URL is full URL, extract just the path
            if (imagePath && imagePath.includes('://')) {
                try {
                    const url = new URL(imagePath);
                    imagePath = url.pathname;
                } catch (e) {
                    console.error('Invalid URL:', imagePath);
                }
            }

            if (imagePath) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, imagePath]
                }));
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addColor = () => {
        if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, colorInput.trim()]
            }));
            setColorInput('');
        }
    };

    const removeColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== color)
        }));
    };

    const addSize = () => {
        if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
            setFormData(prev => ({
                ...prev,
                sizes: [...prev.sizes, sizeInput.trim()]
            }));
            setSizeInput('');
        }
    };

    const removeSize = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.filter(s => s !== size)
        }));
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Create a new product in your catalog
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        {/* Short Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Short Description
                            </label>
                            <input
                                type="text"
                                value={formData.shortDesc}
                                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Brief product description"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Description
                            </label>
                            <textarea
                                rows={5}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Detailed product description"
                            />
                        </div>

                        {/* Admin Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Admin Note (Visible to customers)
                            </label>
                            <textarea
                                rows={3}
                                value={formData.adminNote}
                                onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
                                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                                placeholder="Important information for customers (e.g., shipping notice, warranty info, usage instructions)"
                            />
                            <p className="mt-1 text-sm text-gray-500">This note will be highlighted on the product page</p>
                        </div>

                        {/* Price & Compare Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price * ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Compare at Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.comparePrice}
                                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>

                        {/* SKU & Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Product SKU"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Images Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                            />
                            {uploadingImage && <p className="text-sm text-blue-600 mb-2">Uploading...</p>}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={img.startsWith('http') ? img : `/uploads/${img}`}
                                                alt={`Product ${idx + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Colors
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g., Red, Blue, #FF5733"
                                />
                                <button
                                    type="button"
                                    onClick={addColor}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Add
                                </button>
                            </div>
                            {formData.colors.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.colors.map((color, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {color}
                                            <button
                                                type="button"
                                                onClick={() => removeColor(color)}
                                                className="text-red-500 hover:text-red-700 font-bold"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Sizes
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={sizeInput}
                                    onChange={(e) => setSizeInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g., S, M, L, XL"
                                />
                                <button
                                    type="button"
                                    onClick={addSize}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Add
                                </button>
                            </div>
                            {formData.sizes.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.sizes.map((size, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {size}
                                            <button
                                                type="button"
                                                onClick={() => removeSize(size)}
                                                className="text-red-500 hover:text-red-700 font-bold"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Affiliate Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Affiliate Link (Optional)
                            </label>
                            <input
                                type="url"
                                value={formData.affiliateLink}
                                onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="https://example.com/product"
                            />
                            <p className="mt-1 text-sm text-gray-500">External product link for affiliate marketing</p>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Active</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Featured</span>
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Product'}
                            </button>
                            <Link
                                href="/admin/products"
                                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
