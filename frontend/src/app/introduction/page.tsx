'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { SiTiktok } from 'react-icons/si';

export default function IntroductionPage() {
    const [affiliateProducts, setAffiliateProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const tiktokUrl = 'https://www.tiktok.com/@taphoanhadev?is_from_webapp=1&sender_device=pc';
    const tiktokQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tiktokUrl)}`;

    useEffect(() => {
        fetchAffiliateProducts();
    }, []);

    const fetchAffiliateProducts = async () => {
        try {
            const response = await api.get('/products?limit=50');
            const data = response.data.data || response.data || {};
            const productsData = data.products || [];

            // Filter only products with affiliate links
            const affiliateOnly = productsData.filter((p: Product) => p.affiliateLink);
            setAffiliateProducts(Array.isArray(affiliateOnly) ? affiliateOnly : []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setAffiliateProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Minimal */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center text-white">
                        {/* Avatar */}
                        <div className="inline-block relative mb-6">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg bg-white/10">
                                <img
                                    src="https://ui-avatars.com/api/?name=TapHoaNhaDev&size=128&background=6366f1&color=fff&bold=true"
                                    alt="TapHoaNhaDev"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                            TapHoaNhaDev
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            TikTok KOL - Review sản phẩm chất lượng, giá tốt
                        </p>

                        {/* CTA */}
                        <a
                            href={tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:shadow-xl transition-all"
                        >
                            <SiTiktok className="w-5 h-5" />
                            Follow TikTok
                            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats Section - Minimal */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border border-gray-100">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">1K+</div>
                        <div className="text-xs text-gray-600">Sản phẩm</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">50K+</div>
                        <div className="text-xs text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">5★</div>
                        <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">100%</div>
                        <div className="text-xs text-gray-600">Trung thực</div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div id="products" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Sản phẩm đề xuất
                    </h2>
                    <p className="text-gray-600">
                        Sản phẩm đã review trên TikTok
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 aspect-square rounded-lg mb-3" />
                                <div className="h-3 bg-gray-200 rounded mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : affiliateProducts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-xl text-gray-500 mb-2">📦</p>
                        <p className="text-gray-600 text-sm">Chưa có sản phẩm nào được giới thiệu</p>
                        <p className="text-sm text-gray-500 mt-2">Hãy theo dõi TikTok để cập nhật sản phẩm mới nhé!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {affiliateProducts.map((product) => {
                            const imageUrl = product.images && product.images.length > 0
                                ? (product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:5000'}/uploads/${product.images[0]}`)
                                : 'https://via.placeholder.com/400x400?text=No+Image';

                            return (
                                <a
                                    key={product.id}
                                    href={product.affiliateLink || `/products/${product.slug}`}
                                    target={product.affiliateLink ? '_blank' : '_self'}
                                    rel={product.affiliateLink ? 'noopener noreferrer' : ''}
                                    className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                                            }}
                                        />

                                        {/* Affiliate Badge */}
                                        {product.affiliateLink && (
                                            <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow">
                                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                            </div>
                                        )}

                                        {/* Rating */}
                                        {product.averageRating && product.averageRating > 0 && (
                                            <div className="absolute bottom-2 left-2 bg-white/90 rounded px-1.5 py-0.5 flex items-center gap-1">
                                                <span className="text-yellow-400 text-xs">★</span>
                                                <span className="text-xs font-medium text-gray-800">
                                                    {product.averageRating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3">
                                        <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-emerald-600">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            {product.comparePrice && product.comparePrice > product.price && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ${product.comparePrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {product.comparePrice && product.comparePrice > product.price && (
                                            <div className="mt-1">
                                                <span className="text-xs font-semibold text-green-600">
                                                    Tiết kiệm {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA Section - Minimal */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold mb-3">
                        Theo dõi để cập nhật sản phẩm mới
                    </h2>
                    <a
                        href={tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:shadow-xl transition-all"
                    >
                        <SiTiktok className="w-5 h-5" />
                        @taphoanhadev
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
