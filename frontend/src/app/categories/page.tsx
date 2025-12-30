'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Category } from '@/types';
import { useI18n } from '@/contexts/I18nContext';
import { TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const { t } = useI18n();

    useEffect(() => {
        setMounted(true);
        fetchCategories();
    }, []);

    useEffect(() => {
        filterAndSortCategories();
    }, [categories, searchTerm, sortBy]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            // Handle wrapped response from backend
            const data = response.data.data || response.data;
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortCategories = () => {
        let filtered = [...categories];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(cat =>
                cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'products') return (b._count?.products || 0) - (a._count?.products || 0);
            return 0;
        });

        setFilteredCategories(filtered);
    };

    // Show loading during SSR
    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-12"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('categories.title')}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t('categories.subtitle')}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="name">Sắp xếp: Tên A-Z</option>
                        <option value="products">Sắp xếp: Số sản phẩm</option>
                    </select>
                </div>

                {/* Categories Grid - Smaller Cards */}
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-12">
                        <TagIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            {searchTerm ? 'Không tìm thấy danh mục' : t('categories.noCategories')}
                        </h3>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-2 text-sm text-blue-600 hover:underline"
                            >
                                Xóa bộ lọc
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredCategories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?categoryId=${category.id}`}
                                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Category Image - Smaller */}
                                <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                                    {category.image ? (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <TagIcon className="h-12 w-12 text-blue-300" />
                                        </div>
                                    )}
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </div>

                                {/* Category Info - Compact */}
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 line-clamp-1">
                                        {category.name}
                                    </h3>

                                    {/* Product Count */}
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                            {category._count?.products || 0}
                                        </span>
                                        {' '}{category._count?.products === 1 ? t('categories.product') : t('categories.products')}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Results Count */}
                {filteredCategories.length > 0 && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Hiển thị {filteredCategories.length} / {categories.length} danh mục
                    </div>
                )}

                {/* Popular Categories Section */}
                {categories.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Shop by Category?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                                    <TagIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Navigation</h3>
                                <p className="text-gray-600">
                                    Find products quickly by browsing through organized categories tailored to your needs.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                                    <svg
                                        className="h-6 w-6 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated Selection</h3>
                                <p className="text-gray-600">
                                    Each category features handpicked products to ensure quality and variety.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                                    <svg
                                        className="h-6 w-6 text-purple-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Save Time</h3>
                                <p className="text-gray-600">
                                    Skip the search and go directly to the category that interests you most.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
