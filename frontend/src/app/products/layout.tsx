import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sản Phẩm Chất Lượng | Taphoanhadev - KOL TikTok',
    description: 'Khám phá bộ sưu tập sản phẩm được review bởi KOL Taphoanhadev trên TikTok. Sản phẩm chính hãng, giá tốt nhất thị trường, giao hàng nhanh toàn quốc.',
    keywords: 'taphoanhadev, taphoanhadev tiktok, sản phẩm review tiktok, mua sắm online, sản phẩm chất lượng, KOL review',
    openGraph: {
        title: 'Sản Phẩm Chất Lượng | Taphoanhadev TikTok',
        description: 'Sản phẩm được review bởi KOL Taphoanhadev. Chất lượng đảm bảo, giá tốt nhất.',
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Taphoanhadev Store',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sản Phẩm | Taphoanhadev TikTok KOL',
        description: 'Sản phẩm chất lượng được review bởi KOL Taphoanhadev',
    },
    alternates: {
        canonical: '/products',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
