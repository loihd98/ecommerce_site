import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Danh Mục Sản Phẩm | Taphoanhadev - KOL TikTok Review',
    description: 'Khám phá các danh mục sản phẩm đa dạng được review bởi KOL Taphoanhadev trên TikTok. Tìm kiếm sản phẩm chất lượng theo từng phân loại.',
    keywords: 'danh mục sản phẩm, phân loại, taphoanhadev, tiktok review, mua sắm theo danh mục, sản phẩm review',
    openGraph: {
        title: 'Danh Mục Sản Phẩm | Taphoanhadev TikTok',
        description: 'Sản phẩm chất lượng được phân loại và review bởi KOL Taphoanhadev',
        type: 'website',
        locale: 'vi_VN',
        siteName: 'Taphoanhadev Store',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Danh Mục Sản Phẩm | Taphoanhadev',
        description: 'Sản phẩm được review bởi KOL TikTok Taphoanhadev',
    },
    alternates: {
        canonical: '/categories',
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

export default function CategoriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
