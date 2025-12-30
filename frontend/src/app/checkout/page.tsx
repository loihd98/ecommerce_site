'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface NewAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);

  // Card details state
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  // New address state
  const [newAddress, setNewAddress] = useState<NewAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Vietnam',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const tax = subtotal * 0.1;
  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (items.length === 0) {
      router.push('/cart');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, items, router]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/users/addresses');
      const addressList = response.data.data || response.data || [];
      const validAddresses = Array.isArray(addressList) ? addressList : [];
      setAddresses(validAddresses);
      const defaultAddress = validAddresses.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setAddresses([]);
    }
  };

  const validateCardDetails = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Card number validation (16 digits)
    const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNum || cardNum.length !== 16 || !/^\d+$/.test(cardNum)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Card holder validation
    if (!cardDetails.cardHolder.trim()) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    // Expiry date validation (MM/YY format)
    if (!cardDetails.expiryDate || !/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    } else {
      const [month, year] = cardDetails.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation (3 digits)
    if (!cardDetails.cvv || !/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'Please enter a valid 3 or 4-digit CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewAddress = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!newAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!newAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!newAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!newAddress.city.trim()) newErrors.city = 'City is required';
    if (!newAddress.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = async () => {
    if (!validateNewAddress()) return;

    setLoading(true);
    try {
      const response = await api.post('/users/addresses', {
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        address: newAddress.addressLine1,
        addressLine2: newAddress.addressLine2,
        city: newAddress.city,
        state: newAddress.state,
        zipCode: newAddress.postalCode,
        country: newAddress.country,
      });

      await fetchAddresses();
      setSelectedAddressId(response.data.data.id);
      setShowNewAddress(false);
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Vietnam',
      });
      setErrors({});
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(cleaned) });
    }
  };

  const handleExpiryDateChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    if (formatted.length <= 5) {
      setCardDetails({ ...cardDetails, expiryDate: formatted });
    }
  };

  const handleCvvChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }

    if (paymentMethod === 'CARD' && !validateCardDetails()) {
      alert('Please fill in all card details correctly');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const orderData: any = {
        addressId: selectedAddressId,
        items: orderItems,
        paymentMethod,
        notes,
      };

      // Include card details if paying by card
      if (paymentMethod === 'CARD') {
        orderData.cardDetails = {
          last4: cardDetails.cardNumber.slice(-4),
          cardHolder: cardDetails.cardHolder,
          // In production, card details should be sent to a payment processor
          // Never store full card details on your server
        };
      }

      const response = await api.post('/orders', orderData);

      const orderId = response.data.data.id;
      router.push(`/orders/${orderId}?success=true`);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['Shipping', 'Payment', 'Review'].map((label, index) => (
            <div key={label} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${step > index + 1
                  ? 'bg-green-500 text-white'
                  : step === index + 1
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {step > index + 1 ? <CheckIcon className="h-6 w-6" /> : index + 1}
              </div>
              <div className="flex-1 mx-4">
                <p className={`text-sm ${step >= index + 1 ? 'text-black font-semibold' : 'text-gray-500'}`}>
                  {label}
                </p>
              </div>
              {index < 2 && (
                <div
                  className={`flex-1 h-1 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

              {showNewAddress ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="+84 123 456 789"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Street address, P.O. box"
                    />
                    {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Ho Chi Minh City"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="State or Province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="700000"
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={newAddress.country}
                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setShowNewAddress(false);
                        setErrors({});
                      }}
                      className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAddress}
                      disabled={loading}
                      className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No addresses saved</p>
                      <button
                        onClick={() => setShowNewAddress(true)}
                        className="text-black hover:underline font-medium"
                      >
                        + Add a new address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          className={`block p-4 border-2 rounded-lg cursor-pointer ${selectedAddressId === address.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={address.id}
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="sr-only"
                          />
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{address.fullName}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.postalCode}
                              </p>
                              <p className="text-sm text-gray-600">{address.phone}</p>
                            </div>
                            {address.isDefault && (
                              <span className="text-xs bg-black text-white px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </label>
                      ))}

                      <button
                        onClick={() => setShowNewAddress(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-black hover:text-black transition-colors"
                      >
                        + Add a new address
                      </button>
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedAddressId}
                      className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <div className="space-y-4 mb-6">
                <label className={`block p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'CARD' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </label>

                {paymentMethod === 'CARD' && (
                  <div className="ml-4 space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Holder Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cardHolder}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value.toUpperCase() })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="JOHN DOE"
                      />
                      {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardDetails.expiryDate}
                          onChange={(e) => handleExpiryDateChange(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => handleCvvChange(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${errors.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-gray-600 mt-2">
                      <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p>Your card information is encrypted and secure</p>
                    </div>
                  </div>
                )}

                <label className="block p-4 border-2 rounded-lg cursor-pointer border-gray-200 hover:border-gray-300 opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="PAYPAL"
                    disabled
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold">PayPal</p>
                      <p className="text-sm text-gray-600">Coming soon</p>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border-2 rounded-lg cursor-pointer ${paymentMethod === 'COD' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (paymentMethod === 'CARD' && !validateCardDetails()) {
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] && (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.product.images[0]}`}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Special instructions for your order..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">✓ Secure checkout</p>
              <p className="mb-2">✓ Free returns within 30 days</p>
              <p>✓ 24/7 customer support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
