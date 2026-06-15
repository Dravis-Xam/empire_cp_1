// src/components/Header.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import "../styles/Header.css";

import {
  FaChevronDown,
  FaSearch,
  FaShoppingBasket,
  FaUser,
  FaGamepad
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

// 🔥 SMART SEARCH ENGINE
import searchSite, {
  searchIndex,
  resolveSearchNavigation
} from '../services/search';

export default function Header({ options = {} }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const dropdownRefs = useRef({});
  const searchContainerRef = useRef(null);
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
    { icon: <MdOutlineSmartphone />, name: "Smartphones", link: "/category/phones" },
    { icon: <MdOutlineLaptop />, name: "Laptops", link: "/category/laptops" },
    { icon: <MdOutlineTablet />, name: "Tablets", link: "/category/tablets" },
    { icon: <MdHeadphones />, name: "Audio", link: "/category/audio" },
    { icon: <MdOutlineWatch />, name: "Wearables", link: "/category/wearables" },
    { icon: <FaGamepad />, name: "Gaming", link: "/category/gaming" }
  ];

  // -----------------------------
  // CLICK OUTSIDE HANDLER
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown !== null) {
        const isOutside =
          !dropdownRefs.current[activeDropdown]?.contains(event.target);

        if (isOutside) setActiveDropdown(null);
      }

      if (
        searchFocused &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown, searchFocused]);

  // -----------------------------
  // DEBOUNCE SEARCH INPUT
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchValue]);

  // -----------------------------
  // SEARCH RESULTS (FUSE.JS)
  // -----------------------------
  const searchResults = useMemo(() => {
    return searchSite(debouncedValue, 8);
  }, [debouncedValue]);

  // -----------------------------
  // KEYBOARD NAVIGATION
  // -----------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!searchFocused || searchResults.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();

          if (
            activeIndex >= 0 &&
            activeIndex < searchResults.length
          ) {
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused, searchResults, activeIndex]);

  // -----------------------------
  // AUTO SCROLL ACTIVE ITEM
  // -----------------------------
  useEffect(() => {
    if (activeIndex >= 0 && resultsContainerRef.current) {
      const el = resultsContainerRef.current.children[activeIndex];
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown((prev) =>
      prev === dropdown ? null : dropdown
    );
  };

  // -----------------------------
  // SMART NAVIGATION (PAGE + SECTION)
  // -----------------------------
  const handleResultClick = (item) => {
    setSearchValue('');
    setSearchFocused(false);

    resolveSearchNavigation(item, navigate, location);
  };

  const openCart = () => navigate('/cart');

  return (
    <div className="header">
      <Link to="/" className="home-link">
        Empire Hub Phones
      </Link>

      {/* ---------------- NAV ---------------- */}
      <div className="nav">
        <div
          className={`nav-container dropdown-container featured ${
            activeDropdown === 'featured' ? 'active' : ''
          }`}
          ref={(el) => (dropdownRefs.current.featured = el)}
        >
          <div
            className="inner"
            onClick={() => handleDropdownToggle('featured')}
          >
            <span>Featured</span>
            <FaChevronDown />
          </div>

          {activeDropdown === 'featured' && (
            <div className="dropdown-menu">
              {featuredItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  className="dropdown-item"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          className={`nav-container dropdown-container shop ${
            activeDropdown === 'categories' ? 'active' : ''
          }`}
          ref={(el) => (dropdownRefs.current.categories = el)}
        >
          <div
            className="inner"
            onClick={() => handleDropdownToggle('categories')}
          >
            <span>Categories</span>
            <FaChevronDown />
          </div>

          {activeDropdown === 'categories' && (
            <div className="dropdown-menu">
              {categoryItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  className="dropdown-item"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="nav-container">
          <Link to="/contact">Contact</Link>
        </div>

        <div className="nav-container">
          <Link to="/about">About</Link>
        </div>
      </div>

      {/* ---------------- SEARCH ---------------- */}
      <div className="right-actions">
        <div
          ref={searchContainerRef}
          className={`search-container ${
            searchFocused || searchValue ? 'focused' : ''
          }`}
        >
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search pages, sections..."
            className="search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />

          {searchValue && (
            <button
              className="search-clear"
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
                <div className="no-results">
                  No results found
                </div>
              ) : (
                searchResults.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className={`search-result-item ${
                      index === activeIndex
                        ? 'keyboard-active'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleResultClick(item);
                    }}
                  >
                    <span className={`result-tag ${item.type}`}>
                      {item.type}
                    </span>
                    <span className="result-title">
                      {item.title}
                    </span>
                  </a>
                ))
              )}
            </div>
          )}
        </div>

        {/* CART */}
        <span className="cart-icon" onClick={openCart}>
          <FaShoppingBasket />
        </span>

        {/* AUTH */}
        <button
          className="login-btn"
          onClick={() =>
            isAuthenticated ? logout() : navigate('/login')
          }
        >
          {isAuthenticated ? (
            <>
              <IoMdLogOut /> Logout
            </>
          ) : (
            <>
              <IoPerson /> Login
            </>
          )}
        </button>
      </div>
    </div>
  );
}