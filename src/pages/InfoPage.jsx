import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/InfoPage.css';

const pageData = {
  '/about': {
    title: 'About Empire Hub',
    description: 'Your trusted source for modern electronics and premium customer service.',
    content: [
      'Empire Hub Phones is a leading electronics retailer in Nairobi, dedicated to bringing you the latest and greatest in technology. Founded in 2020, we\'ve grown from a small boutique shop to a trusted destination for tech enthusiasts and everyday users alike.',
      'Our Mission: We believe everyone deserves access to quality electronics at fair prices. We curate the finest products from global brands and make them accessible to Nairobi shoppers with exceptional customer service.',
      'What We Offer: From cutting-edge smartphones to powerful laptops, audio equipment, gaming gear, and wearables—we stock a carefully selected range of electronics to suit every need and budget.',
      'Our Commitment: Fast delivery, hassle-free returns, genuine warranty support, and a dedicated customer service team available Monday through Saturday to help you make the right choice.',
      'Why Choose Us: We don\'t just sell products; we build relationships. Our team consists of tech-savvy professionals who understand what matters to you and are ready to help before, during, and after your purchase.',
    ],
  },
  '/contact': {
    title: 'Contact Us',
    description: 'Get in touch with the Empire Hub team—we\'re here to help.',
    content: [
      'Empire Hub is located at Bazaar Plaza, M1 Shop A2, Moi Avenue, Nairobi. Visit us to explore our full selection of electronics.',
      'Phone: +254711485096 - Call us Monday through Saturday, 9 AM to 8 PM for product inquiries, order support, or general questions.',
      'Email: dansonkiio@gmail.com - Send us a detailed message and we\'ll respond within 24 hours.',
      'Store Hours: Monday to Saturday, 9 AM - 8 PM. We\'re closed on Sundays.',
      'How to Find Us: We\'re easily accessible from major Nairobi landmarks. Look for the Empire Hub sign at Bazaar Plaza on Moi Avenue.',
      'Special Requests: Have a unique request or question? Contact us via email or phone, and our team will do their best to accommodate you.',
    ],
  },
  '/faqs': {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about shopping with Empire Hub.',
    content: [
      'Q: How long does delivery take? A: Standard delivery takes 2-4 business days within Nairobi. Same-day delivery and pickup are available for select products. Check your order confirmation for estimated delivery dates.',
      'Q: What is your return policy? A: You can return most items within 14 days of purchase if they\'re unused and in original packaging. Contact our support team with your order number to initiate a return.',
      'Q: Do you ship outside Nairobi? A: Yes! We partner with trusted courier services to deliver nationwide. Shipping fees apply based on location and product weight. Select items may have nationwide free shipping.',
      'Q: Are your products genuine? A: Absolutely. All products sold through Empire Hub are 100% authentic and sourced directly from authorized distributors. We stand behind every product we sell.',
      'Q: Do you offer payment plans? A: We accept various payment methods including MPESA, bank transfers, and card payments. Payment plans may be available for high-value items—ask our team for details.',
      'Q: What warranty do you provide? A: Most products come with manufacturer warranties (typically 12 months). We also offer extended warranty options for added peace of mind.',
    ],
  },
  '/shipping': {
    title: 'Shipping Information',
    description: 'Learn about our fast and reliable shipping options.',
    content: [
      'Nairobi Delivery: We offer same-day delivery for orders placed before 2 PM, subject to product availability. Standard delivery within Nairobi takes 2-4 business days.',
      'Nationwide Shipping: Orders to other parts of Kenya are handled through trusted courier partners. We ensure your package arrives safely and on time. Shipping fees are calculated based on destination and weight.',
      'Free Shipping Offer: Orders over KES 5,000 qualify for free delivery within Nairobi. Outside Nairobi, free shipping applies to orders over KES 10,000.',
      'Urgent Shipping: Need it faster? Express delivery is available for most items in Nairobi. Add an express fee at checkout and receive your order within 24 hours.',
      'Tracking: Once your order ships, you\'ll receive a tracking reference. Use it to monitor your shipment in real time.',
      'Packaging: We carefully package every item with protective materials to ensure it arrives in perfect condition. Fragile items receive extra care and insurance coverage.',
    ],
  },
  '/returns': {
    title: 'Returns & Refunds',
    description: 'Our hassle-free return policy gives you peace of mind.',
    content: [
      '14-Day Return Window: You have 14 days from the delivery date to return any item. The product must be unused, in original condition, and in its original packaging.',
      'How to Initiate a Return: Contact us at +254711485096 or dansonkiio@gmail.com with your order number and reason for return. Our team will guide you through the process.',
      'Return Shipping: We cover return shipping costs for defective items or wrong deliveries. For other returns, you may need to arrange return shipping (costs depend on your location).',
      'Refund Processing: Once we receive and inspect your returned item, refunds are processed within 5-7 business days back to your original payment method.',
      'Exceptions: Items used, damaged due to mishandling, or without original packaging may not qualify for returns. Refurbished or clearance items may have different return policies.',
      'Damaged on Arrival: If your item arrives damaged, report it within 48 hours with photos. We\'ll arrange a replacement or full refund immediately.',
    ],
  },
  '/track-order': {
    title: 'Track Your Order',
    description: 'Monitor your delivery status in real time.',
    content: [
      'Order Confirmation: After placing your order, you\'ll receive a confirmation email with your order number. Keep this number handy for tracking.',
      'Tracking Reference: Once your order ships, you\'ll receive a tracking reference via email or SMS. Use this to check real-time delivery updates.',
      'Real-Time Updates: Track your package status online. You\'ll be notified when your order is out for delivery and when it arrives.',
      'Estimated Delivery: Your order confirmation includes an estimated delivery window. For same-day orders, you\'ll receive a delivery time slot.',
      'Delivery Notification: You\'ll receive an SMS or call when the delivery driver is near. Be available to receive your package.',
      'Need Help? Contact us at dansonkiio@gmail.com or call +254711485096 if you have questions about your delivery or haven\'t received your tracking reference.',
    ],
  },
  '/warranty': {
    title: 'Warranty Registration',
    description: 'Protect your purchase with our warranty programs.',
    content: [
      'Manufacturer Warranty: All new products come with a manufacturer\'s warranty, typically 12 months from the purchase date. This covers defects in materials and workmanship.',
      'How to Register: While most products auto-register, you can also register on the manufacturer\'s website using your product serial number and receipt. Keep your receipt safe!',
      'What\'s Covered: The warranty covers hardware defects and failures due to normal use. It does not cover physical damage, water damage, or misuse.',
      'Extended Warranty: For additional coverage, we offer extended warranty plans (up to 24 months) at reasonable rates. Ask our team for a quote on your device.',
      'Warranty Claims: To claim warranty service, contact us or the manufacturer with your order number and serial number. We\'ll arrange repair or replacement.',
      'Warranty Support: Our team can help with warranty registration, claims, or questions. Reach us at +254711485096 or dansonkiio@gmail.com.',
    ],
  },
  '/delivery': {
    title: 'Free Delivery',
    description: 'Enjoy free shipping on qualifying orders.',
    content: [
      'Free Delivery Threshold: Orders over KES 5,000 qualify for free delivery within Nairobi. It\'s our way of rewarding your trust in us.',
      'Nationwide Free Shipping: Orders exceeding KES 10,000 ship free to most parts of Kenya. Restrictions may apply to very remote areas.',
      'Delivery Timeline: Free delivery typically takes 2-4 business days in Nairobi, and 3-7 days nationwide. Express options are available for a fee.',
      'How It Works: At checkout, free shipping is automatically applied to qualifying orders. No coupon code needed—just add your items and check out.',
      'Exclusions: Some oversized or hazardous items may not qualify for free shipping. You\'ll see any applicable fees clearly before confirming your order.',
      'Same-Day Option: Need faster delivery? Paid express shipping is available for orders placed before 2 PM on business days.',
    ],
  },
  '/support': {
    title: 'Premium Support',
    description: 'Expert help to choose the right electronics and get the most from them.',
    content: [
      'Product Selection Help: Not sure which phone or laptop to choose? Our tech-savvy team is here to help. Call us with your needs and budget, and we\'ll recommend the perfect device.',
      'Setup & Installation: Purchased a new device? We offer setup assistance for phones, laptops, and other electronics. Call our support team for step-by-step guidance.',
      'Technical Support: Having trouble with your device? Contact us for troubleshooting help. We\'ll guide you through solutions or arrange professional service if needed.',
      'Availability: Our support team is available Monday through Saturday, 9 AM to 8 PM. Call +254711485096 or email dansonkiio@gmail.com.',
      'After-Sales Care: We don\'t disappear after you buy. We\'re committed to ensuring you\'re satisfied with your purchase long after delivery.',
      'Loyalty Support: Returning customers get priority support and special offers. We value your business and show it through personalized service.',
    ],
  },
  '/privacy': {
    title: 'Privacy Policy',
    description: 'How we protect your personal information.',
    content: [
      'Data Protection: Your personal information is sacred to us. We use industry-standard encryption and secure systems to keep your data safe from unauthorized access.',
      'What We Collect: We collect only the information needed to process your order and improve your shopping experience (name, email, phone, delivery address, payment details).',
      'How We Use Your Data: We use your information solely to process orders, send updates, provide customer support, and occasionally notify you of special offers (only if you consent).',
      'Data Sharing: We never sell or share your personal data with third parties without your explicit permission. Your information stays with Empire Hub.',
      'Cookies: Our website uses cookies to remember your preferences and improve browsing. You can manage cookie settings through your browser.',
      'Your Rights: You have the right to access, update, or delete your personal information. Contact us at dansonkiio@gmail.com to exercise these rights.',
    ],
  },
  '/terms': {
    title: 'Terms of Service',
    description: 'Please review our terms before using Empire Hub.',
    content: [
      'Agreement: By using our website or making a purchase, you agree to these terms. If you don\'t agree, please don\'t use our services.',
      'Eligibility: You must be at least 18 years old to make purchases from Empire Hub. By ordering, you represent that you meet this requirement.',
      'Product Availability: All products are subject to availability. Prices and availability are accurate at the time of listing but may change. We reserve the right to cancel orders due to stock issues.',
      'Pricing: All prices are in Kenyan Shillings (KES) unless otherwise stated. Prices may change without notice. Your order total includes applicable taxes and delivery fees.',
      'Payment Terms: Payment is due at checkout. We accept various payment methods including MPESA, bank transfers, and cards. Orders are confirmed only after successful payment.',
      'Limitation of Liability: Empire Hub is not liable for indirect, incidental, or consequential damages arising from your use of our website or products.',
    ],
  },
  '/cookies': {
    title: 'Cookie Policy',
    description: 'Understand how we use cookies to enhance your experience.',
    content: [
      'What Are Cookies: Cookies are small files stored on your device that help websites remember your preferences and improve functionality.',
      'How We Use Cookies: We use cookies to remember your login status, shopping cart items, language preferences, and browsing history. This helps us provide a faster, more personalized experience.',
      'Types of Cookies: Session cookies expire when you close your browser. Persistent cookies remain on your device and help us recognize returning visitors.',
      'Third-Party Cookies: We may use analytics tools that place cookies to understand how visitors use our site. This helps us improve our services.',
      'Your Control: You can manage cookie settings through your browser settings. You can disable cookies, but this may limit your shopping experience on our site.',
      'Consent: By using our website, you consent to our use of cookies. If you don\'t agree, please adjust your browser settings or stop using our site.',
    ],
  },
};

export const meta = {
  title: 'Information',
  description: 'Empire Hub information pages for policies, support and frequently asked questions.',
  keywords: ['about', 'contact', 'support', 'faq', 'shipping', 'returns'],
  url: '/info',
};

export const _meta = {
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
