'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdsBlockProps {
    slot: string;
    format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
    layout?: string;
    responsive?: boolean;
    className?: string;
}

export default function GoogleAdsBlock({
    slot,
    format = 'auto',
    layout,
    responsive = true,
    className = '',
}: GoogleAdsBlockProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT;

    useEffect(() => {
        if (!CLIENT_ID || !slot) return;

        try {
            // Load AdSense script if not already loaded
            if (!window.adsbygoogle) {
                const script = document.createElement('script');
                script.async = true;
                script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`;
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);
            }

            // Push ad
            if (window.adsbygoogle && adRef.current) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (error) {
            console.error('Error loading Google Ads:', error);
        }
    }, [CLIENT_ID, slot]);

    if (!CLIENT_ID || !slot) {
        // Show placeholder in development
        return (
            <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
                <p className="text-gray-500 text-sm">
                    📢 Google Ad Placeholder
                    <br />
                    <span className="text-xs">
                        Slot: {slot || 'Not configured'}
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div ref={adRef} className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={CLIENT_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
                {...(layout && { 'data-ad-layout': layout })}
            />
        </div>
    );
}

// Extend Window interface for TypeScript
declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

// Pre-configured ad components for different placements

export function HomepageHeroAd() {
    return (
        <GoogleAdsBlock
            slot="1234567890" // Replace with actual slot
            format="horizontal"
            className="my-8"
        />
    );
}

export function SidebarAd() {
    return (
        <GoogleAdsBlock
            slot="0987654321" // Replace with actual slot
            format="vertical"
            className="mb-6"
        />
    );
}

export function InFeedAd() {
    return (
        <GoogleAdsBlock
            slot="1122334455" // Replace with actual slot
            format="auto"
            layout="in-article"
            className="my-6"
        />
    );
}

export function FooterAd() {
    return (
        <GoogleAdsBlock
            slot="5544332211" // Replace with actual slot
            format="horizontal"
            responsive={true}
            className="py-4"
        />
    );
}
