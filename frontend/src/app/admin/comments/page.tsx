'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import api from '@/lib/api';
import { CheckIcon, XMarkIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Comment {
    id: string;
    content: string;
    productId: string;
    userId: string | null;
    authorName: string | null;
    authorEmail: string | null;
    isApproved: boolean;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string | null;
    } | null;
    product: {
        id: string;
        name: string;
        slug: string;
    };
}

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterApproved, setFilterApproved] = useState<string>('all');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
    });

    useEffect(() => {
        fetchComments();
    }, [pagination.page, filterApproved]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(search && { search }),
                ...(filterApproved !== 'all' && { approved: filterApproved })
            });

            const response = await api.get(`/admin/comments?${params}`);
            const data = response.data.data || response.data;

            setComments(data.comments || []);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
                totalPages: data.pagination.totalPages
            }));
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            alert('Không thể tải danh sách bình luận');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchComments();
    };

    const handleApprove = async (commentId: string, isApproved: boolean) => {
        try {
            await api.put(`/admin/comments/${commentId}/approve`, { isApproved });
            fetchComments();
        } catch (error) {
            console.error('Failed to update comment:', error);
            alert('Không thể cập nhật bình luận');
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

        try {
            await api.delete(`/admin/comments/${commentId}`);
            fetchComments();
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert('Không thể xóa bình luận');
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bình luận</h1>
                    <div className="text-sm text-gray-600">
                        Tổng: {pagination.total} bình luận
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nội dung, tên, email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                value={filterApproved}
                                onChange={(e) => {
                                    setFilterApproved(e.target.value);
                                    setPagination(prev => ({ ...prev, page: 1 }));
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="true">Đã duyệt</option>
                                <option value="false">Chưa duyệt</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>

                {/* Comments Table */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-500">Không có bình luận nào</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Người gửi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nội dung
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thời gian
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {comments.map((comment) => (
                                        <tr key={comment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {comment.user ? (
                                                        <>
                                                            {comment.user.avatar && (
                                                                <img
                                                                    src={comment.user.avatar}
                                                                    alt={comment.user.name}
                                                                    className="w-8 h-8 rounded-full mr-3"
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {comment.user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {comment.user.email}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {comment.authorName || 'Khách'}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {comment.authorEmail}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-md line-clamp-3">
                                                    {comment.content}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <a
                                                    href={`/products/${comment.product.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-emerald-600 hover:text-emerald-800 hover:underline"
                                                >
                                                    {comment.product.name}
                                                </a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {comment.isApproved ? (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                                                        Đã duyệt
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                        Chờ duyệt
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {comment.isApproved ? (
                                                        <button
                                                            onClick={() => handleApprove(comment.id, false)}
                                                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                            title="Bỏ duyệt"
                                                        >
                                                            <XMarkIcon className="w-5 h-5" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleApprove(comment.id, true)}
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Duyệt"
                                                        >
                                                            <CheckIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(comment.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Trang {pagination.page} / {pagination.totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trước
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
