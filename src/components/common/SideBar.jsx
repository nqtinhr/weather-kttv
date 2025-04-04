import './SideBar.css'
import React, { useEffect, useState } from 'react'

export const SideBar = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleToggle = (e) => {
      setIsActive(e.detail);
    };

    document.addEventListener('sidebarToggle', handleToggle);
    
    return () => {
      document.removeEventListener('sidebarToggle', handleToggle);
    };
  }, []);

  const handleOverlayClick = () => {
    setIsActive(false);
    const event = new CustomEvent('sidebarToggle', { detail: false });
    document.dispatchEvent(event);
  };

  return (
    <>
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <div className="sidebar-item">
          <span>Bản đồ</span>
        </div>
        <div className="sidebar-item">
          <span>Bảng số liệu</span>
        </div>
      </div>
      <div 
        className="overlay" 
        style={{ display: isActive ? 'block' : 'none' }} 
        onClick={handleOverlayClick}
      ></div>
    </>
  );
};
