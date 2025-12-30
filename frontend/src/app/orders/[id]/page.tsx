'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id, isAuthenticated, router]);

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      const orderData = response.data.data;
      // Ensure items is always an array
      if (orderData && !Array.isArray(orderData.items)) {
        orderData.items = [];
      }
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PROCESSING: 'bg-emerald-100 text-emerald-800',
      SHIPPED: 'bg-teal-100 text-teal-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
        <Link href="/orders" className="text-black hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-start gap-4">
          <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">
              Order placed successfully!
            </h3>
            <p className="text-sm text-green-800">
              Your order #{order.orderNumber} has been received and is being processed.
              We'll send you an email with tracking information once it ships.
            </p>
          </div>
        </div>
      )}

      {/* Order Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <Link href="/orders" className="text-sm text-gray-600 hover:text-black">
            ← Back to orders
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="font-semibold">#{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.product.images[0]}`}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product?.slug}`}
                      className="font-semibold hover:text-gray-600"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              <p className="font-semibold text-gray-900">{order.address?.fullName}</p>
              <p>{order.address?.addressLine1}</p>
              {order.address?.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>
                {order.address?.city}, {order.address?.state} {order.address?.postalCode}
              </p>
              <p>{order.address?.country}</p>
              <p className="mt-2">Phone: {order.address?.phone}</p>
            </div>
          </div>

          {order.notes && (
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">Order Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <p className="font-semibold">{order.paymentMethod}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === 'PAID'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            {order.trackingNumber && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <p className="font-semibold">{order.trackingNumber}</p>
              </div>
            )}

            {order.status === 'PENDING' && (
              <button
                onClick={async () => {
                  if (confirm('Cancel this order?')) {
                    try {
                      await api.put(`/orders/${order.id}/cancel`);
                      router.push('/orders');
                    } catch (error) {
                      alert('Failed to cancel order');
                    }
                  }
                }}
                className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
