import './MapMenu.css'
import React from 'react'

export const MapMenu = () => {
  return (
    <div className='menu-container'>
      <ul className='menu-list'>
        <li className='menu-item' id='rain'>
          <i className='fas fa-cloud-rain menu-icon'></i>
          <span>Lượng mưa</span>
        </li>
        <li className='menu-item' id='water-level'>
          <i className='fas fa-water menu-icon'></i>
          <span>Mực nước</span>
        </li>
        <li className='menu-item' id='temperature'>
          <i className='fas fa-thermometer-half menu-icon'></i>
          <span>Nhiệt độ</span>
        </li>
        <li className='menu-item' id='wind'>
          <i className='fas fa-wind menu-icon'></i>
          <span>Gió</span>
        </li>
        <li className='menu-item' id='humidity'>
          <i className='fa-solid fa-droplet menu-icon'></i>
          <span>Độ ẩm</span>
        </li>
        <li className='menu-item' id='pressure'>
          <i className='fa-solid fa-gauge menu-icon'></i>
          <span>Áp suất</span>
        </li>
      </ul>
    </div>
  )
}
