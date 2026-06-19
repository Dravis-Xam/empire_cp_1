import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/HomePage.css'

export default function HomePage() {
  return (
    <div className='homepage'>
      <main className='home-main'>
        <section className='home-hero'>
          <div>
            <h1>Empire Hub Phones</h1>
            <p>Shop premium electronics, discover curated deals, and checkout seamlessly with MPESA.</p>
            <div className='home-actions'>
              <Link to='/shop' className='hero-btn'>Start Shopping</Link>
              <Link to='/contact' className='hero-secondary'>Need help?</Link>
            </div>
          </div>
          <div className='home-hero-card'>
            <div>
              <span>Best Seller</span>
              <h2>Empire Edge Pro</h2>
              <p>Fast, reliable, and built for modern Nairobi shoppers.</p>
            </div>
          </div>
        </section>

        <section className='home-overview'>
          <div className='overview-card'>
            <h3>Fast Checkout</h3>
            <p>Pay using MPESA-like flow for quick and safe payments.</p>
          </div>
          <div className='overview-card'>
            <h3>Persistent Cart</h3>
            <p>Your cart stays saved even after refresh or closing the browser.</p>
          </div>
          <div className='overview-card'>
            <h3>Live Categories</h3>
            <p>Browse by phones, laptops, tablets, audio, gaming, and more.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export const meta = {
  title: 'Empire Hub Home',
  description: 'Welcome to Empire Hub, a modern electronics store with fast checkout and product discovery.',
  url: '/',
}

export const _meta = {
  title: 'Empire Hub Home',
  description: 'Welcome to Empire Hub, a modern electronics store with fast checkout and product discovery.',
  keywords: ['home', 'electronics', 'mpesa', 'shop', 'store'],
  url: '/',
}

export const searchSections = [
  {
    title: 'Home Introduction',
    anchor: 'home-intro',
    description: 'Discover Empire Hub main features and navigate to shopping pages.',
    keywords: ['home', 'shop', 'electronics', 'mpesa', 'checkout'],
  },
]