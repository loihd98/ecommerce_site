'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { User, Order } from '@/types';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    const [userData, setUserData] = useState<User | null>(null);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchUserData();
    }, [isAuthenticated, user, router, params.id]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            // Note: You may need to add these endpoints to the backend
            const userResponse = await api.get(`/admin/users/${params.id}`);
            setUserData(userResponse.data.data);

            // Fetch user's orders
            const ordersResponse = await api.get(`/admin/orders?userId=${params.id}`);
            const ordersData = ordersResponse.data.data || ordersResponse.data || [];
            setUserOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            // For now, just show basic info
            setUserData(null);
            setUserOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (newRole: 'USER' | 'ADMIN') => {
        if (!userData) return;
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        setUpdating(true);
        try {
            await api.put(`/admin/users/${userData.id}`, { role: newRole });
            setUserData({ ...userData, role: newRole });
            alert('User role updated successfully');
        } catch (error) {
            console.error('Failed to update user role:', error);
            alert('Failed to update user role');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="h-64 bg-gray-200 rounded" />
                            <div className="lg:col-span-2 h-64 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (!userData) {
        return (
            <AdminLayout>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">User not found</h2>
                        <Link href="/admin/users" className="text-blue-600 hover:underline">
                            ← Back to Users
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">User Details</h1>
                    <Link href="/admin/users" className="text-sm text-gray-600 hover:text-black">
                        ← Back to Users
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar - User Info */}
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">User Information</h2>
                            <div className="space-y-4">
                                {userData.avatar && (
                                    <div className="flex justify-center mb-4">
                                        <img
                                            src={userData.avatar}
                                            alt={userData.name}
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Name
                                    </label>
                                    <p className="font-medium">{userData.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Email
                                    </label>
                                    <p className="font-medium">{userData.email}</p>
                                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${userData.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {userData.isEmailVerified ? 'Verified' : 'Not Verified'}
                                    </span>
                                </div>

                                {userData.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            Phone
                                        </label>
                                        <p className="font-medium">{userData.phone}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Role
                                    </label>
                                    <select
                                        value={userData.role}
                                        onChange={(e) => handleRoleChange(e.target.value as 'USER' | 'ADMIN')}
                                        disabled={updating}
                                        className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black ${userData.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 font-medium' : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Member Since
                                    </label>
                                    <p className="font-medium">
                                        {new Date(userData.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Orders</span>
                                    <span className="font-semibold">{userOrders.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Spent</span>
                                    <span className="font-semibold">${totalSpent.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Order</span>
                                    <span className="font-semibold">
                                        ${userOrders.length > 0 ? (totalSpent / userOrders.length).toFixed(2) : '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Order History</h2>
                            {userOrders.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No orders yet</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                                                    Order #
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                                                    Date
                                                </th>
                                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">
                                                    Status
                                                </th>
                                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">
                                                    Total
                                                </th>
                                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userOrders.map((order) => (
                                                <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium">#{order.orderNumber}</td>
                                                    <td className="py-3 px-4">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                                    order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                                                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                            'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right font-semibold">
                                                        ${order.total.toFixed(2)}
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="text-black hover:underline text-sm"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
