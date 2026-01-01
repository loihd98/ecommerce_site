'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import api from '@/lib/api';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface Comment {
    id: string;
    content: string;
    authorName: string | null;
    authorEmail: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatar: string | null;
    } | null;
}

interface ProductCommentsProps {
    productId: string;
}

export default function ProductComments({ productId }: ProductCommentsProps) {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [productId, page]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/comments/products/${productId}/comments?page=${page}&limit=10&approved=true`);
            const data = response.data.data || response.data;

            if (page === 1) {
                setComments(data.comments || []);
            } else {
                setComments(prev => [...prev, ...(data.comments || [])]);
            }

            setHasMore(page < (data.pagination?.totalPages || 1));
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            alert('Vui lòng nhập nội dung bình luận');
            return;
        }

        if (!isAuthenticated && (!authorName.trim() || !authorEmail.trim())) {
            alert('Vui lòng nhập tên và email');
            return;
        }

        try {
            setSubmitting(true);
            await api.post(`/comments/products/${productId}/comments`, {
                content: content.trim(),
                ...(!isAuthenticated && {
                    authorName: authorName.trim(),
                    authorEmail: authorEmail.trim()
                })
            });

            setContent('');
            setAuthorName('');
            setAuthorEmail('');
            alert('Bình luận của bạn đã được gửi và đang chờ duyệt!');

            // Reload comments
            setPage(1);
            fetchComments();
        } catch (error: any) {
            console.error('Failed to submit comment:', error);
            alert(error.response?.data?.error || 'Không thể gửi bình luận');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Hôm nay';
        if (days === 1) return 'Hôm qua';
        if (days < 7) return `${days} ngày trước`;
        if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
        if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
        return `${Math.floor(days / 365)} năm trước`;
    };

    return (
        <div className="border-t pt-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ChatBubbleLeftIcon className="w-7 h-7 text-emerald-600" />
                Bình luận sản phẩm
            </h2>

            {/* Comment Form */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-8 border border-emerald-100">
                <h3 className="font-semibold text-lg mb-4">Để lại bình luận của bạn</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập bình luận của bạn..."
                            rows={4}
                            className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                            required
                        />
                    </div>

                    {!isAuthenticated && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="text"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder="Tên của bạn *"
                                    className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    value={authorEmail}
                                    onChange={(e) => setAuthorEmail(e.target.value)}
                                    placeholder="Email của bạn *"
                                    className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                        </button>
                        <p className="text-xs text-gray-600">
                            Bình luận sẽ được hiển thị sau khi quản trị viên duyệt
                        </p>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            {loading && page === 1 ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent"></div>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <ChatBubbleLeftIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                {comment.user?.avatar ? (
                                    <img
                                        src={comment.user.avatar}
                                        alt={comment.user.name}
                                        className="w-10 h-10 rounded-full flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {(comment.user?.name || comment.authorName || 'K')[0].toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">
                                            {comment.user?.name || comment.authorName || 'Khách'}
                                        </span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-line break-words">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <div className="text-center pt-4">
                            <button
                                onClick={() => setPage(prev => prev + 1)}
                                disabled={loading}
                                className="px-6 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? 'Đang tải...' : 'Xem thêm bình luận'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
