import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreatePetTagOrderMutation, useConfirmPaymentMutation } from '../../apis/user/users';

const TAG_PRICE = 0; // Tags are free
const SHIPPING = 2.95; // Shipping cost in euros

// Initialize Stripe using environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY || '');

// Check if Stripe key is configured
if (!import.meta.env.VITE_STRIPE_PUBLISH_KEY) {
  console.warn('VITE_STRIPE_PUBLISH_KEY is not set in environment variables');
}

// Payment Form Component
const PaymentForm = ({ 
  quantity, 
  petName, 
  totalCost, 
  tagColor, 
  phone, 
  street, 
  city, 
  state, 
  zipCode, 
  country, 
  onClose, 
  onSuccess,
  onFormChange
}: {
  quantity: number;
  petName: string;
  totalCost: number;
  tagColor: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  onClose: () => void;
  onSuccess: (orderData: any) => void;
  onFormChange: (field: string, value: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // RTK Query hooks
  const [createPetTagOrder] = useCreatePetTagOrderMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Get the payment method from Stripe Elements
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Payment method creation failed');
        setIsProcessing(false);
        return;
      }

      // Create order using RTK Query
      const orderResult = await createPetTagOrder({
        quantity,
        petName,
        totalCostEuro: totalCost,
        tagColor,
        phone,
        street,
        city,
        state,
        zipCode,
        country
      }).unwrap();

      // Confirm the payment with Stripe
      const { error: confirmError } = await stripe.confirmCardPayment(orderResult.payment.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed');
        setIsProcessing(false);
        return;
      }

      // Payment successful - confirm with backend
      await confirmPayment({
        orderId: orderResult.order._id,
        paymentData: {
          paymentIntentId: orderResult.payment.paymentIntentId
        }
      }).unwrap();

      // Payment successful
      onSuccess(orderResult);
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-afacad font-semibold text-[24px] text-[#222]">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-afacad font-semibold text-[16px] text-[#222] mb-2">Order Summary</h3>
              <div className="text-sm text-gray-600">
                <p><strong>Pet Name:</strong> {petName}</p>
                <p><strong>Quantity:</strong> {quantity} tag(s)</p>
                <p><strong>Tag Color:</strong> {tagColor}</p>
                <p><strong>Total Cost:</strong> €{totalCost.toFixed(2)}</p>
              </div>
            </div>

            {/* Tag Color */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                Tag Color*
              </label>
              <select
                value={tagColor}
                onChange={(e) => onFormChange('tagColor', e.target.value)}
                className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                required
              >
                <option value="">Select tag color</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="pink">Pink</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
                <option value="black">Black</option>
                <option value="white">White</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                Phone Number*
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                required
              />
            </div>

            {/* Street Address */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                Street Address*
              </label>
              <input
                type="text"
                placeholder="Enter street address"
                value={street}
                onChange={(e) => onFormChange('street', e.target.value)}
                className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                required
              />
            </div>

            {/* City and State Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  City*
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => onFormChange('city', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  State*
                </label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) => onFormChange('state', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
            </div>

            {/* Zip Code and Country Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  Zip Code*
                </label>
                <input
                  type="text"
                  placeholder="Enter zip code"
                  value={zipCode}
                  onChange={(e) => onFormChange('zipCode', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  Country*
                </label>
                <input
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => onFormChange('country', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
            </div>

            {/* Payment Card */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                Payment Card*
              </label>
              
              {/* Stripe Card Element */}
              <div className="border border-[#E0E0E0] rounded-[8px] p-3 bg-[#FAFAFA]">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#222',
                        fontFamily: 'Afacad, sans-serif',
                        '::placeholder': {
                          color: '#636363',
                        },
                        iconColor: '#4CB2E2',
                      },
                      invalid: {
                        color: '#e53e3e',
                        iconColor: '#e53e3e',
                      },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
              
              <div className="mt-2 text-xs text-[#636363]">
                Your card details are securely processed by Stripe
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full py-3 rounded-[8px] bg-[#4CB2E2] text-white font-afacad font-semibold text-[17px] shadow-md hover:bg-[#38a1d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay €${totalCost.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const [quantity, setQuantity] = useState(1);
  const [petName, setPetName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tagColor: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const total = SHIPPING.toFixed(2);

  const handleCompleteOrder = () => {
    if (!petName.trim()) {
      alert('Please enter a pet name');
      return;
    }
    setShowModal(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOrderSuccess = (orderData: any) => {
    alert('Order completed successfully!');
    setShowModal(false);
    // Reset form
    setQuantity(1);
    setPetName('');
    setFormData({
      tagColor: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fafbfc] to-[#f8fafd]">
      {/* Title & Subtitle */}
      <div className="mb-8 text-center">
        <div className="font-afacad font-semibold text-[24px] text-[#222] mb-2">Order more tags</div>
        <div className="font-afacad text-[15px] text-[#636363]">You are on the Premium Plus plan, so you can order as many tags as you need.</div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[16px] shadow-lg px-6 py-7 w-full max-w-[670px]">
        {/* How many tags */}
        <div className="mb-4">
          <div className="font-afacad font-semibold text-[16px] text-[#222] mb-1">How many tags do you need?</div>
          {/* <div className="font-afacad text-[13px] text-[#636363]">Dispatched today if you order in the next: <span className="font-semibold text-[#222]">2 hours, 13 minutes</span></div> */}
        </div>
        <hr className="my-4 border-[#E0E0E0]" />

        {/* Quantity Selector */}
        <div className="mb-4">
          <div className="font-afacad font-semibold text-[15px] text-[#222] mb-2">Quantity:</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E0E0E0] bg-white shadow-sm hover:bg-[#f3f3f3] transition"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <svg width="18" height="18" fill="none" stroke="#B0B0B0" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 12h12"/></svg>
            </button>
            <span className="w-8 text-center font-afacad font-semibold text-[16px]">{quantity}</span>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#4CB2E2] shadow-sm hover:bg-[#38a1d6] transition"
              onClick={() => setQuantity(q => q + 1)}
              aria-label="Increase quantity"
            >
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></svg>
            </button>
          </div>
        </div>

        {/* Pet Name Input */}
        <input
          type="text"
          placeholder="Pet Name"
          className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition mb-4"
          value={petName}
          onChange={e => setPetName(e.target.value)}
        />

        {/* Order Summary */}
        <div className="divide-y divide-[#E0E0E0] mb-6">
          <div className="flex justify-between items-center py-3 font-afacad text-[15px] text-[#222]">
            <span>{quantity}x Digital Tails Tag</span>
            <span className="text-green-600 font-semibold">FREE</span>
          </div>
          <div className="flex justify-between items-center py-3 font-afacad text-[15px] text-[#636363]">
            <span>Shipping & Handling</span>
            <span>€{SHIPPING.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-3 font-afacad font-semibold text-[16px] text-[#222]">
            <span>Total</span>
            <span>€{total}</span>
          </div>
        </div>

        {/* Complete Order Button */}
        <button
          type="button"
          onClick={handleCompleteOrder}
          className="w-full py-3 rounded-[8px] bg-[#4CB2E2] text-white font-afacad font-semibold text-[17px] shadow-md hover:bg-[#38a1d6] transition"
        >
          Complete Order
        </button>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            quantity={quantity}
            petName={petName}
            totalCost={SHIPPING}
            tagColor={formData.tagColor}
            phone={formData.phone}
            street={formData.street}
            city={formData.city}
            state={formData.state}
            zipCode={formData.zipCode}
            country={formData.country}
            onClose={() => setShowModal(false)}
            onSuccess={handleOrderSuccess}
            onFormChange={handleFormChange}
          />
        </Elements>
      )}
    </div>
  );
};

export default Order;