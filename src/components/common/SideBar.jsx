import { NavLink } from 'react-router-dom'
import './SideBar.css'
import React, { useEffect, useState } from 'react'

export const SideBar = () => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleToggle = (e) => {
      setIsActive(e.detail)
    }

    document.addEventListener('sidebarToggle', handleToggle)

    return () => {
      document.removeEventListener('sidebarToggle', handleToggle)
    }
  }, [])

  const handleOverlayClick = () => {
    setIsActive(false)
    const event = new CustomEvent('sidebarToggle', { detail: false })
    document.dispatchEvent(event)
  }

  return (
    <>
      <div className={`sidebar ${isActive ? 'active' : ''}`}>
        <NavLink to='/' className={({ isActive }) => (isActive ? 'link active' : 'link')} end>
          <div className='sidebar-item'>Bản đồ</div>
        </NavLink>
        <NavLink to='/statistic' className={({ isActive }) => (isActive ? 'link active' : 'link')}>
          <div className='sidebar-item'>Bảng số liệu</div>
        </NavLink>
      </div>

      <div className='overlay' style={{ display: isActive ? 'block' : 'none' }} onClick={handleOverlayClick}></div>
    </>
  )
}
