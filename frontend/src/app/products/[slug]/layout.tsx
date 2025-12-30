import { Metadata } from 'next';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://localhost:5000';

async function getProduct(slug: string) {
    try {
        const response = await axios.get(`${API_URL}/products/${slug}`);
        return response.data.data;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const product = await getProduct(params.slug);

    if (!product) {
        return {
            title: 'Product Not Found | Taphoanhadev',
        };
    }

    const productImages = product.images && Array.isArray(product.images)
        ? product.images.map((img: string) => `${MEDIA_URL}${img}`)
        : [];

    const description = product.description || product.shortDesc || `Mua ${product.name} chính hãng với giá tốt nhất. Review bởi KOL Taphoanhadev trên TikTok.`;

    return {
        title: `${product.name} | Taphoanhadev - Review Sản Phẩm TikTok`,
        description,
        keywords: `${product.name}, mua ${product.name}, ${product.category?.name || 'sản phẩm'}, taphoanhadev, review tiktok, ${product.sku || ''}`,
        openGraph: {
            title: `${product.name} - Review by Taphoanhadev`,
            description,
            images: productImages,
            type: 'website',
            locale: 'vi_VN',
            siteName: 'Taphoanhadev Store',
            url: `/products/${params.slug}`,
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description,
            images: productImages[0] ? [productImages[0]] : [],
        },
        alternates: {
            canonical: `/products/${params.slug}`,
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
            'product:price:amount': product.price?.toString() || '0',
            'product:price:currency': 'USD',
            'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
            'product:condition': 'new',
        },
    };
}

export default function ProductDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
