import React, { useState } from 'react'
import '../styles/Profile.css'

export default function Profile() {
  const { user, logout } = useAuth();
  const [activeForm, setActiveForm] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const editProfileForm = () => {
    const handleSubmit = () => {}
    return (
        <div className={`edit-profile-container ${activeForm ? "active-form" : ""}`}>
            <h2>
                Edit Profile Details
            </h2>
            <form action="">
                <div className='input-container'>
                    <input type="email" name="email" id="email-input" />
                    <span className='custom-placeholder'>Email</span>
                </div>
                <div className='input-container'>
                    <input type="text" name="name" id="name-input" />
                    <span className='custom-placeholder'>Name</span>
                </div>
                <button className='submit-edit-btn' onClick={handleSubmit}>
                    Update
                </button>
            </form>
        </div>
    )
  }
  
  return (
    <div className='profile-container'>
        <h2>Profile</h2>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
        <div className='profile-actions'>
            <button className='edit-btn' onClick={() => handleEditForm()}>Edit</button>
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}
