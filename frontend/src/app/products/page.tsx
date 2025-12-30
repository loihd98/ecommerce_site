'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { Product } from '@/types';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, FireIcon } from '@heroicons/react/24/outline';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sort: 'createdAt:desc',
  });
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchPopularProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters.sort]);

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

  const fetchPopularProducts = async () => {
    try {
      const response = await api.get('/products?limit=5&sort=averageRating:desc');
      const data = response.data.data || response.data || {};
      const productsData = data.products || [];
      setPopularProducts(Array.isArray(productsData) ? productsData.slice(0, 5) : []);
    } catch (error) {
      console.error('Failed to fetch popular products:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: 12,
        sort: filters.sort,
      };

      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minRating) params.minRating = filters.minRating;

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
        setPagination({
          page: data.pagination.page || 1,
          totalPages: data.pagination.totalPages || 1,
          totalCount: data.pagination.totalCount || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sort: 'createdAt:desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  // Filter Sidebar Component
  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`space-y-6 ${isMobile ? 'p-6' : ''}`}>
      {/* Category Filter */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">📂 Danh mục</h4>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer hover:bg-emerald-50 p-2 rounded transition-colors">
            <input
              type="radio"
              checked={filters.categoryId === ''}
              onChange={() => handleFilterChange('categoryId', '')}
              className="mr-2 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm">Tất cả</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center cursor-pointer hover:bg-emerald-50 p-2 rounded transition-colors">
              <input
                type="radio"
                checked={filters.categoryId === cat.id}
                onChange={() => handleFilterChange('categoryId', cat.id)}
                className="mr-2 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">💰 Khoảng giá</h4>
        <div className="px-2 pb-2">
          <Slider
            range
            min={0}
            max={1000}
            value={priceRange}
            onChange={(value) => {
              if (Array.isArray(value)) {
                setPriceRange(value);
                handleFilterChange('minPrice', value[0].toString());
                handleFilterChange('maxPrice', value[1].toString());
              }
            }}
            trackStyle={[{ backgroundColor: '#16a34a', height: 6 }]}
            handleStyle={[
              { borderColor: '#16a34a', height: 18, width: 18, marginTop: -6, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
              { borderColor: '#16a34a', height: 18, width: 18, marginTop: -6, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
            ]}
            railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
          />
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-emerald-600 font-medium">${priceRange[0]}</span>
            <span className="text-gray-400">-</span>
            <span className="text-emerald-600 font-medium">${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">⭐ Đánh giá</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer hover:bg-emerald-50 p-2 rounded transition-colors">
              <input
                type="radio"
                checked={filters.minRating === rating.toString()}
                onChange={() => handleFilterChange('minRating', rating.toString())}
                className="mr-2 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rating ? 'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}>★</span>
                ))}
                <span className="text-sm ml-1">trở lên</span>
              </div>
            </label>
          ))}
          <label className="flex items-center cursor-pointer hover:bg-emerald-50 p-2 rounded transition-colors">
            <input
              type="radio"
              checked={filters.minRating === ''}
              onChange={() => handleFilterChange('minRating', '')}
              className="mr-2 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm">Tất cả</span>
          </label>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-semibold text-sm text-gray-900 mb-3">🔃 Sắp xếp</h4>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="createdAt:desc">Mới nhất</option>
          <option value="price:asc">Giá: Thấp đến cao</option>
          <option value="price:desc">Giá: Cao đến thấp</option>
          <option value="name:asc">Tên: A-Z</option>
        </select>
      </div>

      <div className="pt-4 space-y-2">
        <button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
        >
          Áp dụng
        </button>
        <button
          onClick={clearFilters}
          className="w-full border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Desktop Sidebar with Filters + Popular Products */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-4 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FunnelIcon className="w-5 h-5 text-emerald-600" />
                Bộ lọc
              </h3>
              <FilterSidebar />
            </div>

            {/* Popular Products */}
            {popularProducts.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-800">
                  <FireIcon className="w-5 h-5 text-orange-500" />
                  Sản phẩm nổi bật
                </h3>
                <div className="space-y-3">
                  {popularProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex gap-3 p-2 bg-white rounded-lg hover:shadow-md transition-all group"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        {product.images && product.images[0] ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${product.images[0]}`}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-1">
                          {product.averageRating && product.averageRating > 0 ? (
                            <>
                              <span className="text-yellow-400 text-xs">★</span>
                              <span className="text-xs text-gray-600">{product.averageRating.toFixed(1)}</span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">Chưa có đánh giá</span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-emerald-600 mt-1">${product.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <>
            {/* Overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Drawer */}
            <div className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto shadow-2xl animate-slide-in">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-emerald-600" />
                  Bộ lọc sản phẩm
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <FilterSidebar isMobile />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="hidden sm:block px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium"
              >
                Tìm kiếm
              </button>
              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <FunnelIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Lọc</span>
              </button>
            </form>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-emerald-600">{products.length}</span> trong tổng số <span className="font-semibold">{pagination.totalCount}</span> sản phẩm
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg mb-2">📦 Không tìm thấy sản phẩm</p>
              <p className="text-sm text-gray-400">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {product.images && product.images[0] ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${product.images[0]}`}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isFeatured && (
                        <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                          ⭐ Nổi bật
                        </span>
                      )}
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                          -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                        </span>
                      )}
                    </div>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg">Hết hàng</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 line-clamp-2 transition-colors min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>
                    )}
                    {/* Rating */}
                    {product.averageRating && product.averageRating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex text-xs">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= product.averageRating! ? "text-yellow-400" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
                      </div>
                    )}
                    {/* Price */}
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg font-bold text-emerald-600">${product.price.toFixed(2)}</p>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <span className="px-4 py-2 text-sm">
                Trang <span className="font-semibold text-emerald-600">{pagination.page}</span> / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
