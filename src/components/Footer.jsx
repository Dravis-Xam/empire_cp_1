// src/components/Footer.jsx
import React, { useEffect } from 'react'
import { 
  FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub
} from 'react-icons/fa'
import { IoMdFlash } from 'react-icons/io'
import '../styles/Footer.css'
import { FaTiktok, FaX } from 'react-icons/fa6'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const handleScroll = () => {
      const backToTop = document.querySelector('.back-to-top')
      if (backToTop) {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible')
        } else {
          backToTop.classList.remove('visible')
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const quickLinks = [
    { name: "About Us", link: "/about" },
    { name: "Contact Us", link: "/contact" },
    { name: "FAQs", link: "/faqs" },
    { name: "Shipping Info", link: "/shipping" },
    { name: "Returns & Refunds", link: "/returns" },
    { name: "Track Order", link: "/track-order" }
  ]

  const categories = [
    { name: "Smartphones", link: "/category/phones" },
    { name: "Laptops", link: "/category/laptops" },
    { name: "Tablets", link: "/category/tablets" },
    { name: "Audio", link: "/category/audio" },
    { name: "Gaming", link: "/category/gaming" },
    { name: "Accessories", link: "/category/accessories" }
  ]

  const services = [
    { name: "Warranty Registration", link: "/warranty" },
    { name: "Free Delivery", link: "/delivery" },
    { name: "Easy Returns", link: "/returns" },
    { name: "Premium Support", link: "/support" }
  ]

  const storeInfo = {
    address: "Bazaar Plaza, M1 Shop A2, Moi Avenue, Nairobi",
    phone: "+254711485096",
    email: "dansonkiio@gmail.com",
    hours: "Mon-Sat: 9AM - 8PM"
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <IoMdFlash className="logo-icon" />
              <span>Empire Hub</span>
              <span className="logo-badge">Phones</span>
            </div>
            <p className="footer-description">
              Your premier destination for the latest smartphones, laptops, 
              and cutting-edge electronics. Quality products, competitive prices, 
              and exceptional customer service.
            </p>
            {/* Social Links - Icons Only */}
            <div className="social-links">
              <a href="https://www.google.com/url?sa=i&source=web&rct=j&url=https://www.facebook.com/empirehubphones/&ved=2ahUKEwj80p_R6YiVAxWBKvsDHdp0MbAQy_kOegoIAggACAAIAxAB&opi=89978449&cd&psig=AOvVaw0NTlEl3P4IxmKrU3fjHIvW&ust=1781598471014000" target='_blank' className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://x.com/empirehub_254" target='_blank' className="social-link" aria-label="X">
                <FaX />
              </a>
              <a href="https://www.google.com/url?sa=i&source=web&rct=j&url=https://www.instagram.com/empire_phone_hub/&ved=2ahUKEwj80p_R6YiVAxWBKvsDHdp0MbAQy_kOegoIAggACAAIBhAF&opi=89978449&cd&psig=AOvVaw0NTlEl3P4IxmKrU3fjHIvW&ust=1781598471014000" target='_blank' className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@empirehub3" target='_blank' className="social-link" aria-label="TikTok">
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Quick Links Column - Text Only */}
          <div className="footer-col">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.link}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column - Text Only */}
          <div className="footer-col">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              {categories.map((category, index) => (
                <li key={index}>
                  <a href={category.link}>{category.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column - Text Only */}
          <div className="footer-col">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              {services.map((service, index) => (
                <li key={index}>
                  <a href={service.link}>{service.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info Column - Text Only */}
          <div className="footer-col info-col">
            <h3 className="footer-title">Store Information</h3>
            <ul className="contact-info">
              <li>
                <span className="info-label">Address:</span>
                <span>{storeInfo.address}</span>
              </li>
              <li>
                <span className="info-label">Phone:</span>
                <span>{storeInfo.phone}</span>
              </li>
              <li>
                <span className="info-label">Email:</span>
                <span>{storeInfo.email}</span>
              </li>
              <li>
                <span className="info-label">Hours:</span>
                <span>{storeInfo.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Subscribe to our Newsletter</h3>
              <p>Get the latest updates on new products and exclusive offers</p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section - No Icons */}
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} Empire Hub Phones. All rights reserved.</p>
            <div className="legal-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  )
}