import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import '../styles/CartPage.css';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1>Your Cart</h1>
          <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your bag</p>
        </div>
        <button className="checkout-link" onClick={() => navigate('/checkout')} disabled={cart.length === 0}>
          Proceed to checkout
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is currently empty.</p>
          <Link to="/shop" className="empty-cart-button">Shop products</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-body">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="cart-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-meta">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>${totalPrice.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Continue to MPESA checkout
            </button>
            <Link to="/shop" className="continue-shopping">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
