// src/components/Header.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Using Router for seamless transitions
import "../styles/Header.css";
import { FaChevronDown, FaSearch, FaShoppingBasket, FaUser, FaGamepad } from 'react-icons/fa';
import { FaMobile } from 'react-icons/fa6';
import { IoMdFlash, IoMdLogOut } from 'react-icons/io';
import { MdOutlineSmartphone, MdOutlineLaptop, MdOutlineTablet, MdHeadphones, MdOutlineWatch } from 'react-icons/md';
import { IoPerson } from "react-icons/io5";
import useAuth from '../hooks/useAuth';
import searchSite, {searchIndex} from '../services/search';

export default function Header({ options = {} }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // 1. New State for Keyboard Navigation & Debouncing
  const [debouncedValue, setDebouncedValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1); // Tracks which search item is highlighted

  const dropdownRefs = useRef({});
  const searchContainerRef = useRef(null);
  const resultsContainerRef = useRef(null); // Ref to scroll items dynamically via keyboard
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const featuredItems = [
    { icon: <IoMdFlash />, name: "New Arrivals", link: "/new" },
    { icon: <FaMobile />, name: "Best Sellers", link: "/bestsellers" },
    { icon: <FaGamepad />, name: "Deals of the Day", link: "/deals" },
    { icon: <FaUser />, name: "Trending Now", link: "/trending" }
  ];

  const categoryItems = [
    { icon: <MdOutlineSmartphone />, name: "Smartphones", link: "/category/phones" },
    { icon: <MdOutlineLaptop />, name: "Laptops", link: "/category/laptops" },
    { icon: <MdOutlineTablet />, name: "Tablets", link: "/category/tablets" },
    { icon: <MdHeadphones />, name: "Audio", link: "/category/audio" },
    { icon: <MdOutlineWatch />, name: "Wearables", link: "/category/wearables" },
    { icon: <FaGamepad />, name: "Gaming", link: "/category/gaming" }
  ];

  // Global click-outside listener to manage dropping down panels
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle navigation dropdowns
      if (activeDropdown !== null) {
        const isOutside = !dropdownRefs.current[activeDropdown]?.contains(event.target);
        if (isOutside) {
          setActiveDropdown(null);
        }
      }
      // Close search results panel if clicking completely outside the search layout
      if (searchFocused && searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, searchFocused]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setSearchFocused(false)
    setActiveIndex(-1);
  }, [searchValue]);

  // 4. Keyboard Listener: Traps Focus, Handles Arrow Keys, Enter, and Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!searchFocused || searchResults.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault(); // Stop webpage from scrolling down
          setActiveIndex((prevIndex) => 
            prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault(); // Stop webpage from scrolling up
          setActiveIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < searchResults.length) {
            handleResultClick(searchResults[activeIndex]);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setSearchFocused(false);
          setActiveIndex(-1);
          document.querySelector('.search-input')?.blur(); // Remove text input blinking cursor
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused, searchResults, activeIndex]);

  // 5. Autoscroll Dropdown Viewport: Ensures keyboard highlights remain visible inside scrolling lists
  useEffect(() => {
    if (activeIndex >= 0 && resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Process and memoize query results efficiently
  const searchResults = useMemo(() => {
    return searchSite(debouncedValue, searchIndex);
  }, [debouncedValue, searchIndex]);

  // Click behavior logic (Routing + Smooth Scroll Anchors)
  const handleResultClick = (item) => {
    setSearchValue(''); // Clear query string
    setSearchFocused(false); // Dim down UI panels

    const [path, hash = ''] = item.url.split('#');

    if (location.pathname === path) {
      scrollToSection(hash);
    } else {
      navigate(path);
      setTimeout(() => scrollToSection(hash), 150); // Slight delay gives React time to switch views and mount DOM elements
    }
  };

  const scrollToSection = (hashId) => {
    if (!hashId) return;
    const element = document.getElementById(hashId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-setting');
      setTimeout(() => element.classList.remove('highlight-setting'), 2000);
    }
  };

  const openCart = () => {
    navigate('/cart'); // Swapped window.location.href to SPA router transitions
  };

  return (
    <div className='header'>
      <Link to='/' className='home-link'>Empire Hub Phones</Link>

      <div className="nav" id="nav">
        {/* Featured Dropdown */}
        <div 
          className={`nav-container dropdown-container featured ${activeDropdown === 'featured' ? 'active' : ''}`}
          ref={(el) => {
  dropdownRefs.current.featured = el;
}}
        >
          <div className='inner' onClick={() => handleDropdownToggle('featured')}>
            <span>Featured</span>
            <FaChevronDown className={`icon ${activeDropdown === 'featured' ? 'rotated' : ''}`}/>
          </div>
          {activeDropdown === 'featured' && (
            <div className="dropdown-menu slide-morph">
              {featuredItems.map((item, index) => (
                <Link to={item.link} key={index} className="dropdown-item">
                  <span className="dropdown-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Categories Dropdown */}
        <div 
          className={`nav-container dropdown-container shop ${activeDropdown === 'categories' ? 'active' : ''}`}
          ref={el => dropdownRefs.current.categories = el}
        >
          <div className='inner' onClick={() => handleDropdownToggle('categories')}>
            <span>Categories</span>
            <FaChevronDown className={`icon ${activeDropdown === 'categories' ? 'rotated' : ''}`} />
          </div>
          {activeDropdown === 'categories' && (
            <div className="dropdown-menu slide-morph">
              {categoryItems.map((item, index) => (
                <Link to={item.link} key={index} className="dropdown-item">
                  <span className="dropdown-icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="nav-container contact">
          <div className="inner">
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        
        <div className="nav-container about">
          <div className="inner">
            <Link to="/about">About</Link>
          </div>
        </div>
      </div>

      <div className="right-actions">
        <div 
          ref={searchContainerRef}
          className={`search-container ${searchFocused || searchValue ? 'focused' : ''}`}
        >
          <FaSearch className='search-icon' />
          <input 
            type="text"
            placeholder="Search products, pages or settings..."
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
          {searchValue && (
            <button className="search-clear" onClick={() => { setSearchValue(''); setDebouncedValue(''); }}>✕</button>
          )}
          
          {searchFocused && searchValue && (
            <div className="search-results-container" ref={resultsContainerRef}>
              {searchResults.length === 0 ? (
                <div className="no-results">No results found :(</div>
              ) : (
                searchResults.map((item, index) => (
                  <a 
                    href={item.url} 
                    key={item.id} 
                    // 6. Bind active styles based on our key state tracker index
                    className={`search-result-item ${index === activeIndex ? 'keyboard-active' : ''}`}
                    onClick={(e) => { e.preventDefault(); handleResultClick(item); }}
                  >
                    <span className={`result-tag ${item.type}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="result-title">{item.title}</span>
                  </a>
                ))
              )}
            </div>
          )}
        </div>

        <span className="cart-icon" onClick={openCart}>
          <FaShoppingBasket className='icon' />
          <span className="cart-badge">3</span>
        </span>
        
        <button className='login-btn' onClick={() => {
            isAuthenticated ? logout() : navigate('/login');
        }}>
            { isAuthenticated 
                ? <>
                    <IoMdLogOut className='btn-icon' />
                    Log out
                </>
                : <>
                    <IoPerson className='btn-icon' />
                    Login
                </>
            }
        </button>
      </div>
    </div>
  );
}
