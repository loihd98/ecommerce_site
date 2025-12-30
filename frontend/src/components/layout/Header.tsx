'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import {
  ShoppingBagIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { itemCount } = useAppSelector((state) => state.cart);

  const handleLogout = async () => {
    await dispatch(logout());
    // Clear redux-persist
    if (typeof window !== 'undefined') {
      localStorage.removeItem('persist:root');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    // Force reload to clear all state
    window.location.href = '/';
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render placeholder during SSR
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              <span>taphoanhadev.com</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6" />
              <div className="w-6 h-6" />
              <div className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Only use these hooks after mounting
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-gray-900 dark:text-white flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0">
            <span className="text-base sm:text-lg md:text-xl">taphoanhadev.com</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('nav.products')}
            </Link>
            <Link href="/categories" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('nav.categories')}
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Contact
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Orders
              </Link>
            )}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="w-5 h-5" />
              ) : (
                <SunIcon className="w-5 h-5" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
                aria-label="Change language"
              >
                <LanguageIcon className="w-5 h-5" />
                <span className="text-xs font-medium uppercase">{locale}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setLocale('en');
                      setLangMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLocale('vi');
                      setLangMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Tiếng Việt
                  </button>
                </div>
              )}
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:block p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="hidden sm:block p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Wishlist"
              >
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Cart"
            >
              <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="Account"
                >
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Tài khoản
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Đơn hàng
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Quản trị
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex btn-primary text-sm px-4 py-2">
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-gray-700 dark:text-gray-300"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 animate-fade-in">
            <input
              type="search"
              placeholder="Search products..."
              className="input"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/products"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Danh mục
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đơn hàng
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  href="/wishlist"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Yêu thích
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account"
                    className="text-gray-700 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tài khoản
                  </Link>
                  <Link
                    href="/cart"
                    className="text-gray-700 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giỏ hàng ({itemCount})
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 font-medium"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
