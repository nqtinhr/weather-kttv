import "./Slider.css";
import React from 'react'

export const Slider = () => {
  return (
    <div className='slider-container'>
      <button id='play-pause-btn'>
        <i className='fas fa-play'></i>
      </button>
      <div className='slider'>
        <input type='range' id='datetime-range' min='0' max='23' step='1' value='0' />
        <span id='tooltip'></span>
      </div>
    </div>
  )
}
