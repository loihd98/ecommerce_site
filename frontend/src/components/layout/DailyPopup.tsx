'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DailyPopupProps {
    enabled?: boolean; // Can be disabled
    requireClick?: boolean; // Must click affiliate link to close
    imageUrl?: string;
    title?: string;
    description?: string;
    affiliateLink?: string;
    buttonText?: string;
}

export default function DailyPopup({
    enabled = true,
    requireClick = false,
    imageUrl = '/promo-popup.jpg',
    title = '🎉 Ưu Đãi Đặc Biệt Hôm Nay!',
    description = 'Giảm giá lên đến 50% cho sản phẩm chọn lọc. Đừng bỏ lỡ!',
    affiliateLink = 'https://example.com/deal',
    buttonText = 'Xem Ngay Ưu Đãi',
}: DailyPopupProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        // Check if popup was shown today
        const lastShown = localStorage.getItem('dailyPopupLastShown');
        const today = new Date().toDateString();

        if (lastShown !== today) {
            // Show popup after 3 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [enabled]);

    const handleClose = () => {
        if (requireClick) {
            // Must click affiliate link first
            alert('Vui lòng xem ưu đãi để đóng popup!');
            return;
        }

        setIsVisible(false);
        localStorage.setItem('dailyPopupLastShown', new Date().toDateString());
    };

    const handleAffiliateClick = () => {
        // Mark as clicked today
        localStorage.setItem('dailyPopupLastShown', new Date().toDateString());
        setIsVisible(false);

        // Open affiliate link
        window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
                {/* Close button (only if not requireClick) */}
                {!requireClick && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                        aria-label="Close popup"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-700" />
                    </button>
                )}

                {/* Image */}
                <div className="relative h-64 bg-gradient-to-br from-emerald-500 to-teal-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white p-8">
                            <div className="text-6xl mb-4">🎁</div>
                            <h3 className="text-3xl font-bold mb-2">{title}</h3>
                            <p className="text-lg opacity-90">{description}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                    <button
                        onClick={handleAffiliateClick}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                    >
                        {buttonText} →
                    </button>

                    {requireClick && (
                        <p className="mt-4 text-sm text-gray-500">
                            * Bấm vào nút trên để xem ưu đãi và đóng popup
                        </p>
                    )}

                    {!requireClick && (
                        <button
                            onClick={handleClose}
                            className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Không, cảm ơn
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
