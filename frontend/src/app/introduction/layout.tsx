import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Taphoanhadev - KOL TikTok Review Sản Phẩm Chính Hãng',
    description: 'Theo dõi taphoanhadev trên TikTok (@taphoanhadev) để xem review sản phẩm chất lượng, chia sẻ kinh nghiệm mua sắm và những deal hot. Affiliate marketing uy tín, sản phẩm đảm bảo chính hãng.',
    keywords: 'taphoanhadev, tiktok, KOL review, review sản phẩm, affiliate marketing, đánh giá sản phẩm, taphoanhadev tiktok, mua sắm online, deal hot',
    openGraph: {
        title: 'Taphoanhadev - KOL Review TikTok',
        description: 'Review sản phẩm chất lượng, chia sẻ kinh nghiệm mua sắm từ KOL TikTok Taphoanhadev',
        type: 'profile',
        locale: 'vi_VN',
        siteName: 'Taphoanhadev Store',
        url: '/introduction',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Taphoanhadev - TikTok KOL',
        description: 'Review sản phẩm và chia sẻ kinh nghiệm mua sắm',
    },
    alternates: {
        canonical: '/introduction',
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
    other: {
        'profile:username': 'taphoanhadev',
        'og:profile': 'tiktok',
    },
};

export default function IntroductionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
