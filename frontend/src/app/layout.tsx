import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/Provider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { I18nProvider } from '@/contexts/I18nContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/layout/Chatbot';
import PromoBanner from '@/components/layout/PromoBanner';
import DailyPopup from '@/components/layout/DailyPopup';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: '🏪 taphoanhadev.com - Tạp Hóa Online',
  description: 'Cửa hàng tạp hóa trực tuyến - Mua sắm dễ dàng, giao hàng nhanh chóng tại taphoanhadev.com',
  keywords: 'tạp hóa, mua sắm online, giao hàng nhanh, taphoanhadev',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 overflow-x-hidden">
        <ReduxProvider>
          <ThemeProvider>
            <I18nProvider>
              <GoogleAnalytics />
              <div className="flex flex-col min-h-screen overflow-x-hidden">
                <PromoBanner />
                <Header />
                <main className="flex-grow overflow-x-hidden">{children}</main>
                <Footer />
                <Chatbot />
                <DailyPopup
                  enabled={true}
                  requireClick={false}
                  title="🎉 Ưu Đãi Đặc Biệt!"
                  description="Giảm giá lên đến 50% cho sản phẩm chọn lọc"
                  affiliateLink="https://example.com/deals"
                  buttonText="Xem Ngay Ưu Đãi"
                />
              </div>
            </I18nProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
