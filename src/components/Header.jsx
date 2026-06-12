import React from 'react'
import "../styles/Header.css"
import { FaChevronDown, FaSearch } from 'react-icons/fa'
import { FaPerson } from 'react-icons/fa6'

export default function Header({options = {}}) {
  return (
    <div
        className='header'
    >
        <a href='/' className='home-link'>Empire Hub Phones</a>

        <div className="nav" id="nav">
            <div className="dropdown-container featured">
                <span>Featured</span>
                <FaChevronDown className='icon'/>
            </div>
            <div className="dropdown-container shop">
                <span>Shop</span>
                <FaChevronDown className='icon' />
            </div>
            <div className="contact"></div>
            <div className="about"></div>
        </div>

        <div className="right-actions">
            <span><FaSearch  className='icon'/></span>
            <span><FaPerson  className='icon'/></span>
            <button className='login-btn'>Login</button>
        </div>
    </div>
  )
}
