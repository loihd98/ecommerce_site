'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { Product, Category } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/admin/Pagination';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function AdminProductsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchCategories();
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, searchTerm, selectedCategory]);

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

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
            };
            if (searchTerm) params.search = searchTerm;
            if (selectedCategory) params.categoryId = selectedCategory;

            const response = await api.get('/products', { params });
            const data = response.data.data || response.data || {};
            const productsData = data.products || [];

            // Clean image arrays for all products
            const cleanedProducts = (Array.isArray(productsData) ? productsData : []).map((product: any) => {
                if (product && Array.isArray(product.images)) {
                    product.images = product.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
                } else {
                    product.images = [];
                }
                return product;
            });

            setProducts(cleanedProducts);

            if (data.pagination) {
                setTotalPages(data.pagination.totalPages || 1);
                setTotalCount(data.pagination.totalCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
            alert('Product deleted successfully');
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchProducts();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading && currentPage === 1) {
        return (
            <AdminLayout>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Manage your product catalog
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 font-medium text-xs text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="text-left py-4 px-6 font-medium text-xs text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="text-left py-4 px-6 font-medium text-xs text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="text-left py-4 px-6 font-medium text-xs text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="text-left py-4 px-6 font-medium text-xs text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-right py-4 px-6 font-medium text-xs text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                    {product.images && product.images[0] ? (
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${product.images[0]}`}
                                                            alt={product.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                            N/A
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500">{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-700">
                                            {product.category?.name || 'N/A'}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-sm font-medium ${product.stock > 10
                                                ? 'text-green-600'
                                                : product.stock > 0
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                                }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/admin/products/${product.id}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={deletingId === product.id}
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalCount}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
