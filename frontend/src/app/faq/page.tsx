'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            category: 'Orders & Shipping',
            question: 'How long does shipping take?',
            answer: 'Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days. International shipping may take 10-21 business days depending on your location.',
        },
        {
            category: 'Orders & Shipping',
            question: 'Do you ship internationally?',
            answer: 'Yes! We ship to most countries worldwide. International shipping costs and delivery times vary by location. You can see the exact shipping cost at checkout.',
        },
        {
            category: 'Orders & Shipping',
            question: 'How can I track my order?',
            answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history.',
        },
        {
            category: 'Orders & Shipping',
            question: 'Can I change or cancel my order?',
            answer: 'You can modify or cancel your order within 1 hour of placing it. After that, the order may have already been processed. Please contact customer service immediately if you need to make changes.',
        },
        {
            category: 'Returns & Refunds',
            question: 'What is your return policy?',
            answer: 'We accept returns within 30 days of delivery. Items must be unused, in original packaging, with tags attached. Some items like intimate apparel, custom orders, and sale items marked as "Final Sale" cannot be returned.',
        },
        {
            category: 'Returns & Refunds',
            question: 'How do I return an item?',
            answer: 'Log into your account, go to Order History, select the order, and click "Request Return". Follow the instructions to print your prepaid return label. Pack the item securely and drop it off at any carrier location.',
        },
        {
            category: 'Returns & Refunds',
            question: 'When will I receive my refund?',
            answer: 'Once we receive and inspect your return (2-3 business days), your refund will be processed automatically. It typically takes 5-10 business days for the refund to appear in your account.',
        },
        {
            category: 'Returns & Refunds',
            question: 'Do I have to pay for return shipping?',
            answer: 'Return shipping costs $7.99 and will be deducted from your refund. However, if you received a defective, damaged, or wrong item, return shipping is free.',
        },
        {
            category: 'Account & Orders',
            question: 'Do I need an account to place an order?',
            answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, view order history, and checkout faster on future purchases.',
        },
        {
            category: 'Account & Orders',
            question: 'How do I reset my password?',
            answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a link to reset your password.',
        },
        {
            category: 'Account & Orders',
            question: 'Can I save items for later?',
            answer: 'Yes! You can add items to your wishlist by clicking the heart icon on any product. Your wishlist is saved to your account and accessible anytime.',
        },
        {
            category: 'Products',
            question: 'Are the product images accurate?',
            answer: 'We strive to display product images as accurately as possible. However, colors may vary slightly due to monitor settings and lighting. Please refer to the product description for detailed specifications.',
        },
        {
            category: 'Products',
            question: 'How do I know what size to order?',
            answer: 'Each product page includes a detailed size guide. We recommend checking measurements carefully before ordering. If you\'re between sizes, we suggest sizing up.',
        },
        {
            category: 'Products',
            question: 'When will out-of-stock items be available?',
            answer: 'Restocking times vary by product. You can sign up for email notifications on the product page to be notified when an item is back in stock.',
        },
        {
            category: 'Payment & Pricing',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay.',
        },
        {
            category: 'Payment & Pricing',
            question: 'Is my payment information secure?',
            answer: 'Yes! We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.',
        },
        {
            category: 'Payment & Pricing',
            question: 'Do you offer price matching?',
            answer: 'We do not currently offer price matching. However, we regularly run sales and promotions. Sign up for our newsletter to be notified of special offers.',
        },
        {
            category: 'Payment & Pricing',
            question: 'Do you charge sales tax?',
            answer: 'Sales tax is calculated based on your shipping address and applicable state/local tax rates. You\'ll see the exact tax amount at checkout before completing your purchase.',
        },
    ];

    const categories = Array.from(new Set(faqs.map(faq => faq.category)));

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-600 mb-12">
                Find answers to common questions about orders, shipping, returns, and more.
            </p>

            <div className="space-y-8">
                {categories.map((category) => (
                    <div key={category} className="border-b pb-8 last:border-b-0">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{category}</h2>
                        <div className="space-y-4">
                            {faqs
                                .filter((faq) => faq.category === category)
                                .map((faq, index) => {
                                    const globalIndex = faqs.indexOf(faq);
                                    const isOpen = openIndex === globalIndex;

                                    return (
                                        <div
                                            key={globalIndex}
                                            className="border border-gray-200 rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleFAQ(globalIndex)}
                                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium text-gray-900 pr-8">
                                                    {faq.question}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-gray-700 mb-4">
                    Can't find the answer you're looking for? Please contact our customer support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/contact"
                        className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-center"
                    >
                        Contact Support
                    </Link>
                    <a
                        href="mailto:support@store.com"
                        className="inline-block border border-gray-300 px-6 py-3 rounded-lg hover:bg-white transition-colors text-center"
                    >
                        Email Us
                    </a>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t">
                <Link href="/" className="text-blue-600 hover:underline">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
