import Link from 'next/link';

export default function ReturnsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Refunds Policy</h1>

            <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Return Policy Overview</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We want you to be completely satisfied with your purchase. If you're not happy with your order, we accept returns within 30 days of delivery for a full refund or exchange.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Return Eligibility</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        To be eligible for a return, your item must meet the following conditions:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Item must be unused and in the same condition that you received it</li>
                        <li>Item must be in the original packaging</li>
                        <li>Item must have the receipt or proof of purchase</li>
                        <li>Return must be initiated within 30 days of delivery</li>
                        <li>Items on sale or clearance are final sale and cannot be returned</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Non-Returnable Items</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Certain types of items cannot be returned, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Perishable goods (such as food, flowers, or plants)</li>
                        <li>Custom products (such as special orders or personalized items)</li>
                        <li>Personal care goods (such as beauty products)</li>
                        <li>Hazardous materials, flammable liquids, or gases</li>
                        <li>Intimate or sanitary goods</li>
                        <li>Downloadable software products</li>
                        <li>Gift cards</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How to Initiate a Return</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        To start a return, please follow these steps:
                    </p>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                        <li>
                            Log in to your account and go to your{' '}
                            <Link href="/orders" className="text-blue-600 hover:underline">
                                Order History
                            </Link>
                        </li>
                        <li>Find the order containing the item(s) you wish to return</li>
                        <li>Click on "Request Return" and select the items and reason</li>
                        <li>Print the prepaid return shipping label</li>
                        <li>Pack the item securely in the original packaging</li>
                        <li>Attach the return label and drop off at any carrier location</li>
                    </ol>
                    <p className="text-gray-700 leading-relaxed mt-4">
                        Alternatively, you can contact our customer service team at returns@store.com or call +1 (555) 123-4567 for assistance.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Return Shipping</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Free Returns:</strong> We provide free return shipping labels for most returns. The return shipping cost will be deducted from your refund.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        <strong>Return Shipping Costs:</strong>
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Defective or damaged items: Free return shipping (full refund)</li>
                        <li>Wrong item sent: Free return shipping (full refund)</li>
                        <li>Change of mind: $7.99 will be deducted from your refund</li>
                        <li>International returns: Customer is responsible for return shipping costs</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Refund Processing</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Once we receive your return, we will inspect the item and notify you of the approval or rejection of your refund.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Inspection typically takes 2-3 business days</li>
                        <li>If approved, your refund will be processed automatically</li>
                        <li>Refunds are issued to the original payment method</li>
                        <li>Please allow 5-10 business days for the refund to appear in your account</li>
                        <li>You will receive an email confirmation when your refund is processed</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Exchanges</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you need to exchange an item for a different size, color, or model:
                    </p>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                        <li>Return the original item following the return process above</li>
                        <li>Place a new order for the item you want</li>
                        <li>Once we receive and process your return, you'll receive a full refund</li>
                    </ol>
                    <p className="text-gray-700 leading-relaxed mt-4">
                        This ensures you get your new item as quickly as possible.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Damaged or Defective Items</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you receive a damaged or defective item:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Contact us within 7 days of receiving the item</li>
                        <li>Provide photos of the damage or defect</li>
                        <li>We'll send a replacement immediately or issue a full refund</li>
                        <li>No need to return the damaged item unless requested</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Wrong Item Received</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you receive the wrong item:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Contact us immediately with your order number</li>
                        <li>We'll arrange for the correct item to be sent at no extra charge</li>
                        <li>We'll provide a prepaid return label for the wrong item</li>
                        <li>Full refund will be issued if the correct item is unavailable</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Late or Missing Refunds</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you haven't received your refund yet:
                    </p>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                        <li>Check your bank account again</li>
                        <li>Contact your credit card company (it may take time for refund to post)</li>
                        <li>Contact your bank (there's often processing time before refund is posted)</li>
                        <li>If you've done all of this and still haven't received your refund, contact us at refunds@store.com</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Sale Items</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Only regular priced items may be refunded. Sale items marked as "Final Sale" or "Clearance" cannot be returned unless they are defective or damaged.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Gifts</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If the item was marked as a gift when purchased and shipped directly to you:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>You'll receive a gift credit for the value of your return</li>
                        <li>A gift credit note will be mailed to you once we receive the returned item</li>
                        <li>If the item wasn't marked as a gift, the refund goes to the gift giver</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you have any questions about returns and refunds, please contact us:
                    </p>
                    <ul className="list-none text-gray-700 space-y-2">
                        <li>Email: returns@store.com</li>
                        <li>Phone: +1 (555) 123-4567</li>
                        <li>Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</li>
                        <li>
                            Or visit our{' '}
                            <Link href="/contact" className="text-blue-600 hover:underline">
                                Contact Page
                            </Link>
                        </li>
                    </ul>
                </section>
            </div>

            <div className="mt-12 pt-8 border-t">
                <Link href="/" className="text-blue-600 hover:underline">
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
}
