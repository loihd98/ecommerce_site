'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import { Product, Review } from '@/types';
import { StarIcon, HeartIcon, ShoppingCartIcon, XMarkIcon, MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import ProductComments from '@/components/ProductComments';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (params.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params.slug]);

  // Auto-carousel effect
  useEffect(() => {
    if (product && product.images && product.images.length > 1 && !isZoomOpen) {
      carouselIntervalRef.current = setInterval(() => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
      }, 3000); // Change image every 3 seconds

      return () => {
        if (carouselIntervalRef.current) {
          clearInterval(carouselIntervalRef.current);
        }
      };
    }
  }, [product, isZoomOpen]);

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (!isZoomOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setIsZoomOpen(false);
          break;
        case 'ArrowLeft':
          handlePrevImage();
          break;
        case 'ArrowRight':
          handleNextImage();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, product]);

  const fetchProduct = async (slug: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${slug}`);
      const productData = response.data.data;
      // Ensure images is always an array and filter out invalid values
      if (productData) {
        if (!Array.isArray(productData.images)) {
          productData.images = [];
        } else {
          // Filter out null, undefined, empty string values
          productData.images = productData.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
        }
      }
      setProduct(productData);
      if (productData?.id) {
        fetchRelatedProducts(productData.id);
        fetchReviews(productData.id);
      }
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      const response = await api.get(`/reviews/product/${productId}`);
      const reviewsData = response.data.data || response.data || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    }
  };

  const fetchRelatedProducts = async (productId: string) => {
    try {
      const response = await api.get(`/products/${productId}/related`);
      const productsData = response.data.data || response.data || [];
      // Filter and clean images for each product
      const cleanedProducts = (Array.isArray(productsData) ? productsData : []).map((product: any) => {
        if (product && Array.isArray(product.images)) {
          product.images = product.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
        } else {
          product.images = [];
        }
        return product;
      });
      setRelatedProducts(cleanedProducts);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      setRelatedProducts([]);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Validate color and size if product has options
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity,
          color: selectedColor || undefined,
          size: selectedSize || undefined,
          note: note || undefined,
        })
      ).unwrap();
      alert('Product added to cart!');
    } catch (error: any) {
      if (error.message?.includes('authenticate')) {
        router.push('/login');
      } else {
        alert('Failed to add to cart');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${product?.id}`);
      } else {
        await api.post('/wishlist', { productId: product?.id });
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
    setIsZoomOpen(true);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handlePrevImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleNextImage = () => {
    if (product && product.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-200 aspect-square rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <Link href="/products" className="text-black hover:underline mt-4 inline-block">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link href="/products" className="text-gray-500 hover:text-gray-700">
          Products
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in group"
            onClick={() => handleImageClick(selectedImage)}
          >
            {product.images && product.images[selectedImage] ? (
              <>
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${product.images[selectedImage]}`}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Next image"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
                {/* Zoom Indicator */}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <MagnifyingGlassPlusIcon className="h-4 w-4" />
                  Click to zoom
                </div>
                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Thumbnail Carousel - Horizontal scrollable */}
          {product.images && product.images.length > 1 && (
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
                {product.images.filter(img => img && img.trim() !== '').map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-lg overflow-hidden transition-all ${selectedImage === index
                      ? 'ring-2 ring-black shadow-lg'
                      : 'hover:ring-2 hover:ring-gray-300'
                      }`}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image}`}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-black/10"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* More Images Indicator */}
          {product.images && product.images.length > 3 && (
            <p className="text-sm text-gray-500 text-center">
              +{product.images.length - 3} more {product.images.length - 3 === 1 ? 'image' : 'images'}
            </p>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.averageRating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.averageRating?.toFixed(1) || '0.0'} ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Admin Note */}
          {product.adminNote && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Note
              </h3>
              <p className="text-blue-800 whitespace-pre-line">{product.adminNote}</p>
            </div>
          )}

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600">In stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color {product.colors.length > 0 && <span className="text-red-500">*</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition-all ${selectedColor === color
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size {product.sizes.length > 0 && <span className="text-red-500">*</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-all ${selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this item (e.g., special instructions, gift message)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={toggleWishlist}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {isWishlisted ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Category */}
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600">
              Category:{' '}
              <Link
                href={`/products?category=${product.category?.id}`}
                className="text-black hover:underline"
              >
                {product.category?.name}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.user?.name}</span>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIconSolid
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments Section */}
      <ProductComments productId={product.id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                href={`/products/${relatedProduct.slug}`}
                className="group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {relatedProduct.images && relatedProduct.images[0] ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${relatedProduct.images[0]}`}
                      alt={relatedProduct.name}
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
                <h3 className="text-sm font-medium group-hover:text-gray-600">
                  {relatedProduct.name}
                </h3>
                <p className="text-lg font-semibold mt-1">
                  ${relatedProduct.price.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isZoomOpen && product && product.images && product.images[selectedImage] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative w-full h-full max-w-7xl max-h-screen flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="text-white">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-300">
                  Image {selectedImage + 1} of {product.images.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Zoom Controls */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomOut();
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                  aria-label="Zoom out"
                >
                  <MagnifyingGlassMinusIcon className="h-5 w-5" />
                </button>
                <span className="text-white text-sm min-w-[60px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomIn();
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                  aria-label="Zoom in"
                >
                  <MagnifyingGlassPlusIcon className="h-5 w-5" />
                </button>
                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomOpen(false);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors ml-2"
                  aria-label="Close"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Main Image Container */}
            <div
              className="flex-1 relative overflow-auto flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${product.images[selectedImage]}`}
                  alt={product.name}
                  width={1200}
                  height={1200}
                  className="max-w-none"
                  priority
                />
              </div>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="mt-4 px-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.filter(img => img && img.trim() !== '').map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${selectedImage === index
                        ? 'ring-2 ring-white shadow-lg'
                        : 'opacity-60 hover:opacity-100'
                        }`}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${image}`}
                        alt={`Thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard Hint */}
            <div className="text-center text-white/60 text-xs mt-2 pb-2">
              Use arrow keys to navigate • Click anywhere to close • Scroll to zoom
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
