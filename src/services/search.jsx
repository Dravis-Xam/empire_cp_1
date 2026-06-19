import Fuse from "fuse.js";

let fuseInstance = null;
let indexBuilt = false;
let rawIndex = [];

// Product catalog (synced with ShopPage)
const productCatalog = [
  {
    id: 'phone-1',
    name: 'Empire Edge Pro',
    category: 'phones',
    price: 349.99,
    description: 'Sleek performance smartphone with a vibrant AMOLED display.',
    details: '6.5" display, 128GB storage, 48MP camera, 18W fast charge.',
  },
  {
    id: 'phone-2',
    name: 'Nova Lite',
    category: 'phones',
    price: 249.99,
    description: 'Compact and reliable with long-lasting battery life.',
    details: '5.8" HD display, 64GB storage, 4000mAh battery.',
  },
  {
    id: 'laptop-1',
    name: 'Empire AirBook',
    category: 'laptops',
    price: 749.99,
    description: 'Ultra-thin laptop with modern performance and a premium build.',
    details: 'Intel i5, 16GB RAM, 512GB SSD, 14" FHD display.',
  },
  {
    id: 'tablet-1',
    name: 'Empire Tab S',
    category: 'tablets',
    price: 399.99,
    description: 'A powerful tablet made for streaming, work, and play.',
    details: '10.4" display, 128GB storage, octa-core CPU.',
  },
  {
    id: 'audio-1',
    name: 'Empire Soundbar',
    category: 'audio',
    price: 129.99,
    description: 'Rich home audio with Bluetooth connectivity and bass boost.',
    details: 'Wireless, 5.1 surround, easy wall mount.',
  },
  {
    id: 'gaming-1',
    name: 'Empire Gamepad',
    category: 'gaming',
    price: 59.99,
    description: 'Responsive gaming controller with ergonomic grip.',
    details: 'Wireless, vibration feedback, long battery life.',
  },
  {
    id: 'accessory-1',
    name: 'Empire Power Bank',
    category: 'accessories',
    price: 39.99,
    description: 'Fast recharge power bank with two ports and compact design.',
    details: '10000mAh, USB-C, quick charge support.',
  },
  {
    id: 'wearable-1',
    name: 'Empire Smartwatch',
    category: 'wearables',
    price: 199.99,
    description: 'Fitness-ready smartwatch with sleep tracking and notifications.',
    details: '24/7 heart rate, GPS, water resistant.',
  },
];

const sitePagesConfig = [
  { id: 'page-home', type: 'page', title: 'Home', description: 'Welcome to Empire Store', keywords: ['home', 'main', 'landing'], url: '/' },
  { id: 'page-shop', type: 'page', title: 'Shop', description: 'Browse our latest tech catalog', keywords: ['products', 'store', 'buy', 'electronics'], url: '/shop' },
  { id: 'page-cart', type: 'page', title: 'Cart', description: 'View your selected items', keywords: ['cart', 'basket', 'checkout'], url: '/cart' },
  { id: 'page-checkout', type: 'page', title: 'Checkout', description: 'Complete your purchase', keywords: ['pay', 'buy', 'finalize'], url: '/checkout' },
  { id: 'page-info', type: 'page', title: 'Info', description: 'About our brand and support', keywords: ['about', 'help', 'contact'], url: '/info' }
]

/**
 * Build index ONCE safely (singleton)
 */
function buildIndex() {
  if (indexBuilt) return;

  // 1. Map pages directly from the config array (No eager imports!)
  const pageEntries = sitePagesConfig.map(page => ({
    id: page.id,
    type: "page",
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    url: page.url,
  }));

  // 2. Product entries (Keep exactly as you wrote it)
  const productEntries = productCatalog.map(product => ({
    id: `product-${product.id}`,
    type: 'product',
    title: product.name,
    description: product.description,
    keywords: [product.category, product.details, `${product.price}`, 'electronics'],
    url: `/shop#${product.category}`,
    category: product.category,
    price: product.price,
    details: product.details,
  }));

  // 3. Order entries from localStorage (Keep exactly as you wrote it)
  const orderEntries = [];
  try {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.forEach((order, idx) => {
      orderEntries.push({
        id: `order-${idx}`,
        type: 'order',
        title: `Order #${idx + 1}`,
        description: `${order.items?.length || 0} items - Total: KES ${order.totalPrice || 0}`,
        keywords: ['order', 'purchase', 'checkout', ...(order.items?.map(i => i.name) || [])],
        url: '/checkout',
        orderIndex: idx,
        items: order.items || [],
        totalPrice: order.totalPrice || 0,
        date: order.date,
      });
    });
  } catch (e) {
    console.error('Error loading orders from localStorage:', e);
  }

  rawIndex = [...pageEntries, ...productEntries, ...orderEntries];

  fuseInstance = new Fuse(rawIndex, {
    includeScore: true,
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: "title", weight: 0.6 },
      { name: "keywords", weight: 0.25 },
      { name: "description", weight: 0.15 },
    ],
  });

  indexBuilt = true;
}


/**
 * Force rebuild index (call when cart/orders change)
 */
export function rebuildSearchIndex() {
  indexBuilt = false;
  buildIndex();
}

/**
 * MAIN SEARCH
 */
export function searchSite(query, limit = 8) {
  buildIndex(); // 🔥 safe lazy init

  const q = typeof query === "string" ? query.trim().toLowerCase() : "";
  if (!q) return [];

  const results = fuseInstance.search(q);

  return results.slice(0, limit).map(({ item, score }) => ({
    ...item,
    score: Math.round((1 - (score || 0)) * 100),
  }));
}

/**
 * NAVIGATION HELPER
 */
export function resolveSearchNavigation(item, navigate, location) {
  if (!item?.url) return;

  // Handle product clicks
  if (item.type === 'product') {
    navigate(`/shop#${item.category}`);
    return;
  }

  // Handle order clicks
  if (item.type === 'order') {
    navigate('/checkout');
    return;
  }

  const [path, hash] = item.url.split("#");

  const scrollTo = (id, attempt = 0) => {
    if (!id) return;

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlight-setting");
      setTimeout(() => el.classList.remove("highlight-setting"), 2000);
    } else if (attempt < 10) {
      setTimeout(() => scrollTo(id, attempt + 1), 100);
    }
  };

  if (location.pathname === path) {
    scrollTo(hash);
  } else {
    navigate(path);
    setTimeout(() => scrollTo(hash), 150);
  }
}

/**
 * Optional debug hook
 */
export function getSearchIndex() {
  buildIndex();
  return rawIndex;
}

export default searchSite;