'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, loading, itemCount } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, router]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItem({ itemId, quantity })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Remove this item from cart?')) {
      try {
        await dispatch(removeFromCart(itemId)).unwrap();
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm('Clear all items from cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Add some products to your cart to see them here.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart ({itemCount})</h1>
        <button
          onClick={handleClearCart}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                {item.product.images && item.product.images[0] ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.product.images[0]}`}
                    alt={item.product.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-semibold text-gray-900 hover:text-gray-600"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  ${item.product.price.toFixed(2)} each
                </p>

                {/* Variant Info */}
                {(item.color || item.size) && (
                  <div className="flex gap-3 mt-2 text-sm text-gray-600">
                    {item.color && (
                      <span>
                        <span className="font-medium">Color:</span> {item.color}
                      </span>
                    )}
                    {item.size && (
                      <span>
                        <span className="font-medium">Size:</span> {item.size}
                      </span>
                    )}
                  </div>
                )}

                {/* Note */}
                {item.note && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    Note: {item.note}
                  </p>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="font-semibold text-lg">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {subtotal >= 100 ? 'FREE' : '$10.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold">${(subtotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${(subtotal + (subtotal >= 100 ? 0 : 10) + subtotal * 0.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {subtotal < 100 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                Add ${(100 - subtotal).toFixed(2)} more to get free shipping!
              </div>
            )}

            <Link
              href="/checkout"
              className="block w-full bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 font-semibold"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block w-full text-center py-3 mt-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
