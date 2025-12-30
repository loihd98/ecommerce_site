'use client';

import Link from 'next/link';

export default function HeroBanner() {
    return (
        <section className="relative bg-gradient-to-b from-emerald-50 to-white py-8 md:py-12">
            <div className="container mx-auto px-4">
                {/* 3-Column Banner Layout: 1 large (left) + 2 small stacked (right) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Main Large Banner - Left (2/3 width on desktop) */}
                    <Link 
                        href="/products"
                        className="md:col-span-2 relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="relative h-64 md:h-96 bg-gradient-to-br from-emerald-400 to-teal-500">
                            {/* Placeholder Background Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAxMCBNIDAgNTAgTCAxMCA2MCBNICA2MCBMIDY1IDUwIE0gNjAgMCBMIDUwIDEwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
                                <div className="space-y-3">
                                    <span className="inline-block bg-white/90 backdrop-blur-sm text-emerald-700 text-xs md:text-sm font-bold px-4 py-1.5 rounded-full">
                                        🌿 FRESH COLLECTION
                                    </span>
                                    <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight">
                                        Sản phẩm mới<br />
                                        Chất lượng cao
                                    </h2>
                                    <p className="text-white/90 text-sm md:text-base max-w-md">
                                        Khám phá bộ sưu tập sản phẩm mới nhất với chất lượng đảm bảo
                                    </p>
                                    <button className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-all transform group-hover:scale-105">
                                        Xem ngay
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Right Column - 2 Stacked Banners */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        {/* Top Small Banner */}
                        <Link 
                            href="/categories"
                            className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex-1"
                        >
                            <div className="relative h-32 md:h-44 bg-gradient-to-br from-teal-400 to-emerald-500">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] bg-repeat"></div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4 md:p-6">
                                    <h3 className="text-white text-lg md:text-2xl font-bold mb-1">
                                        Danh mục
                                    </h3>
                                    <p className="text-white/90 text-xs md:text-sm">
                                        Khám phá theo từng danh mục
                                    </p>
                                </div>
                            </div>
                        </Link>

                        {/* Bottom Small Banner */}
                        <Link 
                            href="/introduction"
                            className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex-1"
                        >
                            <div className="relative h-32 md:h-44 bg-gradient-to-br from-green-400 to-emerald-600">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+')]"></div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-4 md:p-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-2xl">🎯</span>
                                        <h3 className="text-white text-lg md:text-2xl font-bold">
                                            KOL Review
                                        </h3>
                                    </div>
                                    <p className="text-white/90 text-xs md:text-sm">
                                        Sản phẩm được đề xuất
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Optional: Feature Highlights */}
                <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">🚚</div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Miễn phí vận chuyển</h4>
                        <p className="text-xs text-gray-600">Đơn từ 500k</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">💎</div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Chất lượng đảm bảo</h4>
                        <p className="text-xs text-gray-600">100% chính hãng</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">🔄</div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Đổi trả dễ dàng</h4>
                        <p className="text-xs text-gray-600">Trong 7 ngày</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl mb-2">🎁</div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Ưu đãi hấp dẫn</h4>
                        <p className="text-xs text-gray-600">Mỗi ngày</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
