'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/imageUtils';
import { Product } from '@/types';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import HeroBanner from '@/components/layout/HeroBanner';

interface Category {
  id: string;
  name: string;
  slug: string;
  products?: Product[];
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [affiliateProducts, setAffiliateProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await api.get('/categories');
      const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];

      // Fetch products for each category
      const categoriesWithProducts = await Promise.all(
        categoriesData.slice(0, 4).map(async (cat: Category) => {
          try {
            const response = await api.get(`/products?categoryId=${cat.id}&limit=4`);
            const data = response.data.data || response.data || {};
            const productsData = data.products || [];
            // Clean image arrays
            const cleanedProducts = (Array.isArray(productsData) ? productsData : []).map((product: any) => {
              if (product && Array.isArray(product.images)) {
                product.images = product.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
              } else {
                product.images = [];
              }
              return product;
            });
            return { ...cat, products: cleanedProducts };
          } catch (error) {
            return { ...cat, products: [] };
          }
        })
      );

      setCategories(categoriesWithProducts);

      // Fetch affiliate products
      const affiliateResponse = await api.get('/products?limit=20');
      const affiliateData = affiliateResponse.data.data || affiliateResponse.data || {};
      const allProducts = affiliateData.products || [];
      // Clean images and filter affiliate products
      const cleanedAllProducts = (Array.isArray(allProducts) ? allProducts : []).map((product: any) => {
        if (product && Array.isArray(product.images)) {
          product.images = product.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
        } else {
          product.images = [];
        }
        return product;
      });
      const affiliateOnly = cleanedAllProducts.filter((p: Product) => p.affiliateLink);
      setAffiliateProducts(Array.isArray(affiliateOnly) ? affiliateOnly.slice(0, 8) : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Banner Component
  const PromoBanner = ({ banners }: { banners: { title: string; subtitle: string; link: string; gradient: string }[] }) => (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Desktop: 2 banners side by side */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {banners.map((banner, index) => (
            <Link
              key={index}
              href={banner.link}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-48"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient}`}>
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] bg-repeat"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-1 group-hover:scale-105 transition-transform">{banner.title}</h3>
                <p className="text-white/90 text-sm">{banner.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: Carousel (single banner at a time) */}
        <div className="md:hidden">
          <Link
            href={banners[0].link}
            className="group relative overflow-hidden rounded-2xl shadow-lg block h-40"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${banners[0].gradient}`}>
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] bg-repeat"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-white text-xl font-bold mb-1">{banners[0].title}</h3>
              <p className="text-white/90 text-xs">{banners[0].subtitle}</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => {
    const imageUrl = product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : null;

    return (
      <Link
        href={product.affiliateLink || `/products/${product.slug}`}
        target={product.affiliateLink ? '_blank' : '_self'}
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
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
          {product.isFeatured && (
            <div className="absolute top-2 left-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                ⭐ Nổi bật
              </span>
            </div>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 line-clamp-2 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
          {/* Rating */}
          {product.averageRating && product.averageRating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex text-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= product.averageRating! ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
            </div>
          )}
          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-emerald-600">${product.price.toFixed(2)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-gray-400 line-through">${product.comparePrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Affiliate Products Section */}
      {affiliateProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-7 h-7 text-emerald-600" />
                  Sản phẩm đề xuất từ KOL
                </h2>
                <p className="text-gray-600 text-sm md:text-base">Review chính xác từ TapHoaNhaDev</p>
              </div>
              <Link href="/introduction" className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm md:text-base flex items-center gap-1">
                Xem tất cả <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {affiliateProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner 1 */}
      <PromoBanner
        banners={[
          { title: '🔥 Flash Sale', subtitle: 'Giảm giá đến 50% - Mua ngay!', link: '/products', gradient: 'from-orange-400 to-red-500' },
          { title: '🎁 Quà tặng', subtitle: 'Miễn phí vận chuyển cho đơn từ 500k', link: '/products', gradient: 'from-pink-400 to-purple-500' },
        ]}
      />

      {/* Category Sections */}
      {loading ? (
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-12">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="bg-gray-200 aspect-square rounded-lg mb-3" />
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        categories.map((category, index) => (
          <div key={category.id}>
            {/* Category Section */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    📂 {category.name}
                  </h2>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm md:text-base flex items-center gap-1"
                  >
                    Xem thêm <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
                {category.products && category.products.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có sản phẩm trong danh mục này</p>
                )}
              </div>
            </section>

            {/* Banner between categories (except after last one) */}
            {index < categories.length - 1 && (
              <PromoBanner
                banners={
                  index === 0
                    ? [
                      { title: '💎 Chất lượng cao', subtitle: 'Sản phẩm chính hãng 100%', link: '/products', gradient: 'from-emerald-400 to-teal-500' },
                      { title: '⚡ Giao hàng nhanh', subtitle: 'Giao trong 24h tại Hà Nội', link: '/products', gradient: 'from-blue-400 to-indigo-500' },
                    ]
                    : [
                      { title: '🌟 Xu hướng mới', subtitle: 'Sản phẩm được yêu thích nhất', link: '/products', gradient: 'from-yellow-400 to-orange-500' },
                      { title: '🔖 Khuyến mãi', subtitle: 'Ưu đãi độc quyền hôm nay', link: '/products', gradient: 'from-green-400 to-emerald-500' },
                    ]
                }
              />
            )}
          </div>
        ))
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🛍️ Khám phá thêm sản phẩm
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Hàng ngàn sản phẩm chất lượng đang chờ bạn
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Xem tất cả sản phẩm
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
