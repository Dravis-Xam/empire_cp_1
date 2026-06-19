import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import checkoutService from '../services/checkout';
import '../styles/CheckoutPage.css';

export const _meta = {
  title: 'Checkout',
  description: 'Complete your Empire Hub order with a secure MPESA-like payment flow.',
  keywords: ['checkout', 'mpesa', 'payment', 'order', 'payment request'],
  url: '/checkout',
};

export const searchSections = [
  {
    title: 'Checkout Form',
    anchor: 'checkout-form',
    description: 'Enter MPESA details and submit your payment request.',
    keywords: ['checkout', 'mpesa', 'phone', 'payment reference'],
  },
];

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [transaction, setTransaction] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !transaction || cart.length === 0) {
      setMessage('Please enter your phone number, transaction reference, and add items to the cart.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await checkoutService.checkoutPayment({
        phone,
        reference: transaction,
        amount: totalPrice,
        items: cart,
      });
      clearCart();
      setMessage('Payment request sent successfully. Please complete the MPESA prompt on your phone.');
      setTimeout(() => navigate('/'), 2400);
    } catch (error) {
      setMessage(error.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-card">
        <h1>MPESA Checkout</h1>
        <p>Review your order and send a payment request to your phone.</p>

        <div className="checkout-summary">
          <div>
            <span>Items</span>
            <strong>{cart.length}</strong>
          </div>
          <div>
            <span>Total amount</span>
            <strong>KES {totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            MPESA Phone Number
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="2547XXXXXXXX"
              required
            />
          </label>

          {/* <label>
            Transaction Reference
            <input
              type="text"
              value={transaction}
              onChange={(e) => setTransaction(e.target.value)}
              placeholder="Enter MPESA reference"
              required
            />
          </label>

          <label>
            Order Notes
            <textarea
              value={`Empire Hub purchase: ${cart.length} item(s)`}
              readOnly
            />
          </label> */}

          {message && <div className="checkout-message">{message}</div>}

          <button className="checkout-submit" type="submit" disabled={submitting || cart.length === 0}>
            {submitting ? 'Sending MPESA request...' : 'Send MPESA Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
