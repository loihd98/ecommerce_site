'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { WishlistItem } from '@/types';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function WishlistPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchWishlist();
    }, [isAuthenticated, router]);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const response = await api.get('/wishlist');
            const wishlistData = response.data.data || response.data || [];
            setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        try {
            await api.delete(`/wishlist/${productId}`);
            setWishlist(wishlist.filter((item) => item.productId !== productId));
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
            alert('Failed to remove item');
        } finally {
            setRemovingId(null);
        }
    };

    const handleAddToCart = async (productId: string) => {
        try {
            await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
            alert('Added to cart!');
        } catch (error: any) {
            alert('Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-200 aspect-square rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-8">
                <HeartIcon className="h-8 w-8 text-red-500" />
                <h1 className="text-3xl font-bold">My Wishlist</h1>
                <span className="text-gray-500">({wishlist.length} items)</span>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center py-16">
                    <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Your wishlist is empty
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Start adding items you love to your wishlist
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            <Link href={`/products/${item.product.slug}`}>
                                <div className="aspect-square bg-gray-100 overflow-hidden">
                                    {item.product.images && item.product.images[0] ? (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.product.images[0]}`}
                                            alt={item.product.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <div className="p-4">
                                <Link href={`/products/${item.product.slug}`}>
                                    <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-600 line-clamp-2">
                                        {item.product.name}
                                    </h3>
                                </Link>
                                <p className="text-xl font-bold mb-4">${item.product.price.toFixed(2)}</p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddToCart(item.productId)}
                                        disabled={item.product.stock === 0}
                                        className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                    >
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        disabled={removingId === item.productId}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
