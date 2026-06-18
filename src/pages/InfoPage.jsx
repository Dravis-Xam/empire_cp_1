import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/InfoPage.css';

const pageData = {
  '/about': {
    title: 'About Empire Hub',
    description: 'Empire Hub is your trusted source for modern electronics and premium customer service built for Nairobi shoppers.',
    content: [
      'We specialize in smartphones, laptops, tablets, audio devices and gaming gear from top brands.',
      'Our team supports fast delivery, easy returns, and real warranty assistance.',
    ],
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Reach out to Empire Hub for product inquiries, support, and order tracking.',
    content: [
      'Email: dansonkiio@gmail.com',
      'Phone: +254711485096',
      'Visit us at Bazaar Plaza, Moi Avenue, Nairobi.',
    ],
  },
  '/faqs': {
    title: 'FAQs',
    description: 'Frequently asked questions for Empire Hub shoppers.',
    content: [
      'How long does delivery take? Orders typically arrive within 2-4 business days.',
      'What is the return policy? You can return most products within 14 days.',
    ],
  },
  '/shipping': {
    title: 'Shipping Information',
    description: 'Shipping details for local Nairobi delivery and nationwide orders.',
    content: [
      'Same-day pickup available for Nairobi orders.',
      'Nationwide deliveries are handled through trusted courier partners.',
    ],
  },
  '/returns': {
    title: 'Returns & Refunds',
    description: 'Returns and refund policy for peace of mind when shopping with Empire Hub.',
    content: [
      'Return eligible items within 14 days if they are unused and in original packaging.',
      'Refunds are processed back to your original payment method within 5-7 business days.',
    ],
  },
  '/track-order': {
    title: 'Track Order',
    description: 'Track your order status and estimated delivery window.',
    content: [
      'Enter your order reference on the tracking page to view shipment updates.',
      'You can also contact support at dansonkiio@gmail.com if you need extra help.',
    ],
  },
  '/warranty': {
    title: 'Warranty Registration',
    description: 'Register your new product for warranty coverage and support.',
    content: [
      'Warranties are valid for 12 months from the date of purchase.',
      'Keep your receipt and order number to claim warranty service.',
    ],
  },
  '/delivery': {
    title: 'Free Delivery',
    description: 'Free delivery options for qualifying orders across Nairobi.',
    content: [
      'Orders over KES 5,000 qualify for free delivery within Nairobi.',
      'Delivery fees may apply for outside Nairobi and urgent shipping.',
    ],
  },
  '/support': {
    title: 'Premium Support',
    description: 'Premium support services to help you choose the right electronics.',
    content: [
      'Our support team is available Monday through Saturday.',
      'We help with product selection, setup, and after-sales care.',
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'Information on how Empire Hub protects your data.',
    content: [
      'We keep your personal information secure and only use it to process orders.',
      'We do not share your data with third parties without your permission.',
    ],
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Terms and conditions for using the Empire Hub website.',
    content: [
      'By using this site, you agree to comply with our terms and policies.',
      'Orders are subject to availability and confirmation.',
    ],
  },
  '/cookies': {
    title: 'Cookie Policy',
    description: 'How Empire Hub uses cookies to improve your experience.',
    content: [
      'Cookies help remember your preferences and speed up page loads.',
      'You can manage cookie settings through your browser.',
    ],
  },
};

export const meta = {
  title: 'Information',
  description: 'Empire Hub information pages for policies, support and frequently asked questions.',
  keywords: ['about', 'contact', 'support', 'faq', 'shipping', 'returns'],
  url: '/info',
};

export const searchSections = [
  {
    title: 'Help and Service Templates',
    anchor: 'info-templates',
    description: 'Explore support pages and company information.',
    keywords: ['about', 'support', 'policy', 'contact', 'returns'],
  },
];

const InfoPage = () => {
  const { pathname } = useLocation();
  const page = pageData[pathname] || {
    title: 'Empire Hub',
    description: 'Learn more about our services and support.',
    content: ['This page is coming soon.'],
  };

  return (
    <div className="info-page">
      <div className="info-card">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <div className="info-content">
          {page.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
        <Link to="/" className="info-back">
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default InfoPage;
