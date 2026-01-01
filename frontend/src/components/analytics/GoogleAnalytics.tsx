'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GoogleAnalytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    useEffect(() => {
        if (!GA_MEASUREMENT_ID) return;

        // Load GA script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script1);

        // Initialize GA
        const script2 = document.createElement('script');
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
      });
    `;
        document.head.appendChild(script2);

        return () => {
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, [GA_MEASUREMENT_ID]);

    // Track page views
    useEffect(() => {
        if (!GA_MEASUREMENT_ID || typeof window.gtag === 'undefined') return;

        const url = pathname + searchParams.toString();
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }, [pathname, searchParams, GA_MEASUREMENT_ID]);

    return null;
}

// Helper functions for tracking events
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

export const trackProductView = (productId: string, productName: string, price: number) => {
    trackEvent('view_item', 'ecommerce', productName, price);
};

export const trackAddToCart = (productId: string, productName: string, price: number) => {
    trackEvent('add_to_cart', 'ecommerce', productName, price);
};

export const trackPurchase = (orderId: string, value: number) => {
    trackEvent('purchase', 'ecommerce', orderId, value);
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}
