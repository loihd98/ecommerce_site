'use client';

import { TruckIcon, ClockIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function ShippingPage() {
  const shippingMethods = [
    {
      name: 'Standard Shipping',
      price: '$10.00',
      duration: '5-7 business days',
      description: 'Reliable delivery for regular orders',
      icon: TruckIcon,
    },
    {
      name: 'Express Shipping',
      price: '$25.00',
      duration: '2-3 business days',
      description: 'Fast delivery for urgent orders',
      icon: ClockIcon,
    },
    {
      name: 'Free Shipping',
      price: 'FREE',
      duration: '5-7 business days',
      description: 'Orders over $100',
      icon: ShieldCheckIcon,
    },
  ];

  const regions = [
    {
      name: 'Domestic (USA)',
      time: '5-7 business days',
      cost: '$10 - $25',
    },
    {
      name: 'Canada',
      time: '7-10 business days',
      cost: '$20 - $35',
    },
    {
      name: 'Europe',
      time: '10-15 business days',
      cost: '$30 - $50',
    },
    {
      name: 'Asia Pacific',
      time: '12-18 business days',
      cost: '$35 - $60',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer flexible shipping options to ensure your orders arrive safely and on time.
          </p>
        </div>

        {/* Shipping Methods */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Methods</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.name}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{method.price}</p>
                  <p className="text-gray-600 mb-2">{method.duration}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Regions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Regions</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shipping Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regions.map((region) => (
                  <tr key={region.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{region.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {region.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {region.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Policy */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policy</h2>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-gray-600">
                Orders are processed within 1-2 business days. Orders placed on weekends and holidays
                will be processed the next business day.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking Information</h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a tracking number via email. You can track your
                package in the Orders section of your account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Enjoy free standard shipping on all orders over $100. Free shipping applies to
                domestic orders only.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">International Shipping</h3>
              <p className="text-gray-600">
                We ship to most countries worldwide. International orders may be subject to customs
                fees and import duties. Customers are responsible for these charges.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Issues</h3>
              <p className="text-gray-600">
                If your package is lost or damaged during shipping, please contact our customer
                support team within 7 days of the expected delivery date.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address Changes</h3>
              <p className="text-gray-600">
                Shipping addresses cannot be changed once an order is processed. Please ensure your
                shipping information is correct before completing your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How can I track my order?
              </h3>
              <p className="text-gray-600">
                You can track your order by logging into your account and visiting the Orders page.
                You'll also receive tracking updates via email.
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600">
                Yes, we ship to most countries worldwide. International shipping rates and delivery
                times vary by location.
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if my package is delayed?
              </h3>
              <p className="text-gray-600">
                If your package is delayed beyond the estimated delivery date, please contact our
                customer support team for assistance.
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my shipping address?
              </h3>
              <p className="text-gray-600">
                Unfortunately, shipping addresses cannot be changed once the order is processed.
                Contact us immediately if you need assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
