'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { Order } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminOrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchOrder();
    }, [isAuthenticated, user, router, params.id]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/orders/${params.id}`);
            const orderData = response.data.data;
            // Ensure items is always an array
            if (orderData && !Array.isArray(orderData.items)) {
                orderData.items = [];
            }
            setOrder(orderData);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            alert('Failed to load order');
            router.push('/admin/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return;

        setUpdating(true);
        try {
            await api.put(`/admin/orders/${order.id}`, { status: newStatus });
            setOrder({ ...order, status: newStatus as any });
            alert('Order status updated successfully');
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PROCESSING: 'bg-blue-100 text-blue-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            REFUNDED: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!order) {
        return (
            <AdminLayout>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Order not found</h2>
                    <Link href="/admin/orders" className="text-black hover:underline">
                        ← Back to Orders
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
                <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-black">
                    ← Back to Orders
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                        {item.productImage ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.productImage}`}
                                                alt={item.productName}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium mb-1">{item.productName}</h3>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${item.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 pt-6 border-t space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span>${order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-${order.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="text-gray-700">
                            <p className="font-medium">{order.address.fullName}</p>
                            <p>{order.address.address}</p>
                            <p>
                                {order.address.city}, {order.address.state} {order.address.zipCode}
                            </p>
                            <p>{order.address.country}</p>
                            <p className="mt-2">Phone: {order.address.phone}</p>
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
                            <p className="text-gray-700">{order.notes}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    disabled={updating}
                                    className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black ${getStatusColor(order.status)}`}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="REFUNDED">Refunded</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Status
                                </label>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>

                            {order.paymentMethod && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Payment Method
                                    </label>
                                    <p className="text-gray-700">{order.paymentMethod}</p>
                                </div>
                            )}

                            {order.trackingNumber && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tracking Number
                                    </label>
                                    <p className="text-gray-700 font-mono text-sm">{order.trackingNumber}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-gray-600">Order Date:</span>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">Last Updated:</span>
                                <p className="font-medium">
                                    {new Date(order.updatedAt).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600">Customer:</span>
                                <p className="font-medium">{order.user?.name}</p>
                                <p className="text-gray-600">{order.user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
