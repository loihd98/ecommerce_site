import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

            <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Modify or copy the materials</li>
                        <li>Use the materials for any commercial purpose or public display</li>
                        <li>Attempt to reverse engineer any software contained on our website</li>
                        <li>Remove any copyright or proprietary notations from the materials</li>
                        <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Terms</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>You are responsible for safeguarding the password you use to access the service</li>
                        <li>You must not share your account with any third party</li>
                        <li>You must notify us immediately upon becoming aware of any breach of security</li>
                        <li>You are responsible for all activities that occur under your account</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Products and Services</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        All products and services are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Product descriptions and images are as accurate as possible but may contain errors</li>
                        <li>We do not warrant that product descriptions or other content is accurate or complete</li>
                        <li>We reserve the right to limit quantities purchased per person, household, or order</li>
                        <li>We reserve the right to refuse any order you place with us</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Orders and Payments</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        By placing an order, you warrant that:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>You are legally capable of entering into binding contracts</li>
                        <li>You are at least 18 years of age</li>
                        <li>All payment information you provide is true and accurate</li>
                        <li>You have authorization to use the payment method provided</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-4">
                        We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product availability, errors in pricing or product information, or problems identified by our fraud detection systems.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Shipping and Delivery</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We will make every effort to deliver products within the estimated timeframes, but delivery times are not guaranteed. We are not liable for any delays in shipments.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Returns and Refunds</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Please review our{' '}
                        <Link href="/returns" className="text-blue-600 hover:underline">
                            Return Policy
                        </Link>
                        {' '}for detailed information about returns and refunds.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Prohibited Uses</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        You may not use our website:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                        <li>To violate any international, federal, provincial, or state regulations</li>
                        <li>To infringe upon or violate our intellectual property rights</li>
                        <li>To harass, abuse, insult, harm, defame, slander, or intimidate</li>
                        <li>To submit false or misleading information</li>
                        <li>To upload viruses or malicious code</li>
                        <li>To spam, phish, or scrape data</li>
                        <li>To interfere with or circumvent security features</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        The service and its original content, features, and functionality are and will remain the exclusive property of the company and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimer</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the service, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        In no event shall our company, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you have any questions about these Terms, please contact us:
                    </p>
                    <ul className="list-none text-gray-700 space-y-2">
                        <li>Email: support@store.com</li>
                        <li>Phone: +1 (555) 123-4567</li>
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
