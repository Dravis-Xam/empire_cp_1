// src/components/Header.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import "../styles/Header.css";

import {
  FaChevronDown,
  FaSearch,
  FaShoppingBasket,
  FaUser,
  FaGamepad,
  FaHome,
  FaSun,
  FaMoon,
} from 'react-icons/fa';

import { FaMobile } from 'react-icons/fa6';
import { IoMdFlash, IoMdLogOut } from 'react-icons/io';
import {
  MdOutlineSmartphone,
  MdOutlineLaptop,
  MdOutlineTablet,
  MdHeadphones,
  MdOutlineWatch
} from 'react-icons/md';

import { IoPerson } from "react-icons/io5";
import useAuth from '../hooks/useAuth';

import searchSite, { resolveSearchNavigation } from '../services/search';

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const dropdownRefs = useRef({});
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const resultsContainerRef = useRef(null);

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
    { icon: <MdOutlineSmartphone />, name: "Smartphones", link: "/shop#phones" },
    { icon: <MdOutlineLaptop />, name: "Laptops", link: "/shop#laptops" },
    { icon: <MdOutlineTablet />, name: "Tablets", link: "/shop#tablets" },
    { icon: <MdHeadphones />, name: "Audio", link: "/shop#audio" },
    { icon: <MdOutlineWatch />, name: "Wearables", link: "/shop#wearables" },
    { icon: <FaGamepad />, name: "Gaming", link: "/shop#gaming" }
  ];

  // ---------------- CLICK OUTSIDE ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        activeDropdown &&
        !dropdownRefs.current[activeDropdown]?.contains(e.target)
      ) {
        setActiveDropdown(null);
      }

      if (
        searchFocused &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, searchFocused]);

  // ---------------- DEBOUNCE ----------------
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(searchValue), 250);
    return () => clearTimeout(t);
  }, [searchValue]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchValue]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // ---------------- SEARCH ----------------
  const searchResults = useMemo(() => {
    return searchSite(debouncedValue, 8);
  }, [debouncedValue]);

  // ---------------- KEYBOARD CONTROL ----------------
  useEffect(() => {
    const handler = (e) => {
      if (!searchFocused || searchResults.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((p) =>
            p < searchResults.length - 1 ? p + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((p) =>
            p > 0 ? p - 1 : searchResults.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0) {
            handleResultClick(searchResults[activeIndex]);
          }
          break;

        case 'Escape':
          setSearchFocused(false);
          setActiveIndex(-1);
          document.querySelector('.search-input')?.blur();
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchFocused, searchResults, activeIndex]);

  // ---------------- SCROLL ACTIVE ITEM ----------------
  useEffect(() => {
    if (activeIndex >= 0 && resultsContainerRef.current) {
      const el = resultsContainerRef.current.children[activeIndex];
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleDropdownToggle = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  // ---------------- SMART NAVIGATION ----------------
  const handleResultClick = (item) => {
    setSearchValue('');
    setSearchFocused(false);
    setActiveIndex(-1);

    resolveSearchNavigation(item, navigate, location);
  };

  const openCart = () => navigate('/cart');

  return (
    <>
      <div className="header">
        <Link to="/" className="home-link">
          Empire Hub Phones
        </Link>

        {/* NAV */}
        <div className="nav">
          <div
            className={`nav-container ${
              activeDropdown === 'featured' ? 'active' : ''
            }`}
            ref={(el) => (dropdownRefs.current.featured = el)}
          >
            <div onClick={() => handleDropdownToggle('featured')}>
              Featured <FaChevronDown />
            </div>

            {activeDropdown === 'featured' && (
              <div className="dropdown-container">
                {featuredItems.map((i, idx) => (
                  <Link key={idx} to={i.link}>
                    {i.icon} {i.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className={`nav-container ${
              activeDropdown === 'categories' ? 'active' : ''
            }`}
            ref={(el) => (dropdownRefs.current.categories = el)}
          >
            <div onClick={() => handleDropdownToggle('categories')}>
              Categories <FaChevronDown />
            </div>

            {activeDropdown === 'categories' && (
              <div className="dropdown-container">
                {categoryItems.map((i, idx) => (
                  <Link key={idx} to={i.link}>
                    {i.icon} {i.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link className='nav-link nav-container' to="/contact">Contact</Link>
          <Link className='nav-link nav-container' to="/about">About</Link>
        </div>

        {/* SEARCH */}
        <div className="right-actions">
          <div
            ref={searchContainerRef}
            className={`search-container ${
              searchFocused || searchValue ? 'focused' : ''
            }`}
            onClick={() => searchInputRef.current?.focus()}
          >
            <FaSearch />

            <input
              ref={searchInputRef}
              className="search-input"
              value={searchValue}
              placeholder="Search pages, items, or orders..."
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchFocused(true)}
            />

            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue('');
                  setDebouncedValue('');
                }}
              >
                ✕
              </button>
            )}

            {/* RESULTS */}
            {searchFocused && searchValue && (
              <div
                className="search-results-container"
                ref={resultsContainerRef}
              >
                {searchResults.length === 0 ? (
                  <div>No results found</div>
                ) : (
                  searchResults.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`search-result-item ${
                        idx === activeIndex ? 'active' : ''
                      }`}
                      data-type={item.type}
                      onClick={() => handleResultClick(item)}
                    >
                      <span className="tag">{item.type}</span>
                      <span>{item.title}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* MAGICAL THEME TOGGLE - Sun/Moon */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div className={`theme-toggle-icon ${theme}`}>
              {theme === 'dark' ? <FaMoon /> : <FaSun />}
            </div>
          </button>

          {/* CART */}
          <span onClick={openCart}>
            <FaShoppingBasket />
          </span>

          {/* AUTH */}
          <button className='login-btn' onClick={() => (isAuthenticated ? logout() : navigate('/login'))}>
            {isAuthenticated ? <IoMdLogOut /> : <IoPerson />}
          </button>
        </div>
      </div>

      {/* MOBILE FLOATING NAV - Rendered outside header */}
      <div className="mobile-bottom-nav">
        <Link to="/" aria-label="Home" className="mobile-nav-item">
          <FaHome />
        </Link>
        <Link to="/shop" aria-label="Shop" className="mobile-nav-item">
          <FaShoppingBasket />
        </Link>
        <button className="mobile-nav-item" type="button" onClick={() => searchInputRef.current?.focus()} aria-label="Search">
          <FaSearch />
        </button>
        <button className="mobile-nav-item" type="button" onClick={() => (isAuthenticated ? logout() : navigate('/login'))} aria-label="Profile">
          {isAuthenticated ? <IoMdLogOut /> : <IoPerson />}
        </button>
      </div>
    </>
  );
}