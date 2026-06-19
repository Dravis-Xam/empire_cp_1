import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import checkoutService from '../services/checkout';
import { rebuildSearchIndex } from '../services/search';
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
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !transaction || cart.length === 0 || !deliveryInfo.fullName) {
      setMessage('Please fill in all required fields and add items to the cart.');
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
      
      // Save order to localStorage
      const order = {
        id: `order-${Date.now()}`,
        items: cart,
        totalPrice,
        phone,
        deliveryInfo,
        date: new Date().toISOString(),
      };
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Rebuild search index to include new order
      rebuildSearchIndex();
      
      clearCart();
      setMessage('Payment request sent successfully. Please complete the MPESA prompt on your phone.');
      setTimeout(() => navigate('/'), 2400);
    } catch (error) {
      setMessage(error.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="checkout-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      
      <div className="checkout-grid">
        <div className="checkout-card">
          <h2>Delivery Information</h2>
          <form className="delivery-form">
            <label>
              Full Name
              <input
                type="text"
                name="fullName"
                value={deliveryInfo.fullName}
                onChange={handleDeliveryChange}
                placeholder="John Doe"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={deliveryInfo.email}
                onChange={handleDeliveryChange}
                placeholder="john@example.com"
                required
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                value={deliveryInfo.phone}
                onChange={handleDeliveryChange}
                placeholder="+254 7XX XXX XXX"
                required
              />
            </label>
            <label>
              Delivery Address
              <textarea
                name="address"
                value={deliveryInfo.address}
                onChange={handleDeliveryChange}
                placeholder="Street address, building, apartment, etc."
                required
              />
            </label>
            <div className="form-row">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={deliveryInfo.city}
                  onChange={handleDeliveryChange}
                  placeholder="Nairobi"
                  required
                />
              </label>
              <label>
                Postal Code
                <input
                  type="text"
                  name="postalCode"
                  value={deliveryInfo.postalCode}
                  onChange={handleDeliveryChange}
                  placeholder="00100"
                  required
                />
              </label>
            </div>
          </form>
        </div>

        <div className="checkout-card">
          <h2>MPESA Checkout</h2>
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
    </div>
  );
};

export default CheckoutPage;
