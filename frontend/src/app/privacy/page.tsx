import Link from 'next/link';

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

            <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Welcome to our Privacy Policy. Your privacy is critically important to us. This Privacy Policy document contains types of information that is collected and recorded by our Store and how we use it.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We collect several types of information for various purposes to provide and improve our service to you:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Personal identification information (Name, email address, phone number, etc.)</li>
                        <li>Shipping and billing addresses</li>
                        <li>Payment information (processed securely through payment gateways)</li>
                        <li>Order history and purchase information</li>
                        <li>Browser and device information</li>
                        <li>Cookies and usage data</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We use the collected information for various purposes:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>To process and fulfill your orders</li>
                        <li>To communicate with you about your orders and account</li>
                        <li>To send you marketing communications (with your consent)</li>
                        <li>To improve our website and services</li>
                        <li>To prevent fraud and enhance security</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used. These third parties have access to your personal data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to processing of your data</li>
                        <li>Request data portability</li>
                        <li>Withdraw consent at any time</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul className="list-none text-gray-700 space-y-2">
                        <li>Email: privacy@store.com</li>
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
