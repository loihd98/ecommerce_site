'use client';

import { useState, useEffect } from 'react';
import { PhoneIcon, EnvelopeIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const hidden = localStorage.getItem('promoBannerHidden');
        if (hidden === 'true') {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('promoBannerHidden', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse"></div>
            </div>

            {/* Info Content */}
            <div className="container mx-auto px-4 py-1.5 md:py-2 relative z-10">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-center md:justify-between gap-1 md:gap-2 text-xs flex-1">
                        {/* Working Hours */}
                        <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            <span className="font-medium text-[10px] md:text-xs">8h-21h (T2-CN)</span>
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <a href="mailto:hideonstorms@gmail.com" className="hidden sm:flex items-center gap-1 hover:text-emerald-100 transition-colors text-[10px] md:text-xs">
                                <EnvelopeIcon className="w-3 h-3 md:w-4 md:h-4" />
                                <span>hideonstorms@gmail.com</span>
                            </a>
                            <a href="tel:0342429911" className="flex items-center gap-1 hover:text-emerald-100 transition-colors text-[10px] md:text-xs">
                                <PhoneIcon className="w-3 h-3 md:w-4 md:h-4" />
                                <span>0342 429 911</span>
                            </a>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                        aria-label="Đóng"
                    >
                        <XMarkIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
