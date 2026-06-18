import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCart from '../hooks/useCart';
import '../styles/ShopPage.css';

const productCatalog = [
  {
    id: 'phone-1',
    name: 'Empire Edge Pro',
    category: 'phones',
    price: 349.99,
    description: 'Sleek performance smartphone with a vibrant AMOLED display.',
    details: '6.5" display, 128GB storage, 48MP camera, 18W fast charge.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'phone-2',
    name: 'Nova Lite',
    category: 'phones',
    price: 249.99,
    description: 'Compact and reliable with long-lasting battery life.',
    details: '5.8" HD display, 64GB storage, 4000mAh battery.',
    image: 'https://images.unsplash.com/photo-1510557880182-3f8d3aabf777?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'laptop-1',
    name: 'Empire AirBook',
    category: 'laptops',
    price: 749.99,
    description: 'Ultra-thin laptop with modern performance and a premium build.',
    details: 'Intel i5, 16GB RAM, 512GB SSD, 14" FHD display.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tablet-1',
    name: 'Empire Tab S',
    category: 'tablets',
    price: 399.99,
    description: 'A powerful tablet made for streaming, work, and play.',
    details: '10.4" display, 128GB storage, octa-core CPU.',
    image: 'https://images.unsplash.com/photo-1536305030011-1ada2615a6f6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'audio-1',
    name: 'Empire Soundbar',
    category: 'audio',
    price: 129.99,
    description: 'Rich home audio with Bluetooth connectivity and bass boost.',
    details: 'Wireless, 5.1 surround, easy wall mount.',
    image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'gaming-1',
    name: 'Empire Gamepad',
    category: 'gaming',
    price: 59.99,
    description: 'Responsive gaming controller with ergonomic grip.',
    details: 'Wireless, vibration feedback, long battery life.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'accessory-1',
    name: 'Empire Power Bank',
    category: 'accessories',
    price: 39.99,
    description: 'Fast recharge power bank with two ports and compact design.',
    details: '10000mAh, USB-C, quick charge support.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'wearable-1',
    name: 'Empire Smartwatch',
    category: 'wearables',
    price: 199.99,
    description: 'Fitness-ready smartwatch with sleep tracking and notifications.',
    details: '24/7 heart rate, GPS, water resistant.',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=800&q=80',
  },
];

const categoryCards = [
  { name: 'phones', label: 'Smartphones' },
  { name: 'laptops', label: 'Laptops' },
  { name: 'tablets', label: 'Tablets' },
  { name: 'audio', label: 'Audio' },
  { name: 'gaming', label: 'Gaming' },
  { name: 'accessories', label: 'Accessories' },
  { name: 'wearables', label: 'Wearables' },
];

const categoryNames = {
  phones: 'Smartphones',
  laptops: 'Laptops',
  tablets: 'Tablets',
  audio: 'Audio',
  gaming: 'Gaming',
  accessories: 'Accessories',
  wearables: 'Wearables',
};

export const meta = {
  title: 'Shop',
  description: 'Browse products in the Empire Hub shop and open details for each item.',
  keywords: ['shop', 'products', 'electronics', 'smartphones', 'laptops', 'tablets'],
  url: '/shop',
};

export const searchSections = [
  {
    title: 'Shop Categories',
    anchor: 'shop-categories',
    description: 'Browse electronics categories in the Empire Hub shop.',
    keywords: ['shop', 'categories', 'products', 'electronics'],
  },
  {
    title: 'Product List',
    anchor: 'product-grid',
    description: 'See product cards and open item details.',
    keywords: ['product', 'details', 'cart', 'buy'],
  },
];

export default function ShopPage() {
  const { hash } = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addItem } = useCart();

  const activeCategory = hash?.replace('#', '') || '';

  const products = useMemo(() => {
    return activeCategory
      ? productCatalog.filter((product) => product.category === activeCategory)
      : productCatalog;
  }, [activeCategory]);

  useEffect(() => {
    if (selectedProduct && activeCategory && selectedProduct.category !== activeCategory) {
      setSelectedProduct(null);
    }
  }, [activeCategory, selectedProduct]);

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div>
          <h1>Empire Hub Shop</h1>
          <p>Browse electronics categories and tap an item to view details instantly.</p>
        </div>
        <div className="shop-quick-links" id="shop-categories">
          {categoryCards.map((category) => (
            <Link key={category.name} to={`/shop#${category.name}`} className={activeCategory === category.name ? 'active' : ''}>
              {category.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="shop-grid" id="product-grid">
        {products.length === 0 ? (
          <p className="shop-empty">No products found for this category.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="shop-card" onClick={() => setSelectedProduct(product)}>
              <img src={product.image} alt={product.name} />
              <div className="shop-card-body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedProduct && (
        <div className="product-panel" role="dialog" aria-modal="true">
          <div className="product-panel-content">
            <button className="product-panel-close" onClick={() => setSelectedProduct(null)}>
              ×
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="product-panel-info">
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <p>{selectedProduct.details}</p>
              <div className="product-panel-meta">
                <span>Category: {categoryNames[selectedProduct.category]}</span>
                <span>Price: ${selectedProduct.price.toFixed(2)}</span>
              </div>
              <button
                className="add-cart-btn"
                onClick={() => {
                  addItem(selectedProduct, 1);
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
