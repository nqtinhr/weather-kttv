import { useEffect, useRef, useState } from 'react'
import './Slider.css'

export const Slider = ({ currentHourIndex, setCurrentHourIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValue, setSliderValue] = useState(currentHourIndex)

  const intervalRef = useRef(null)
  const sliderRef = useRef(null)
  const tooltipRef = useRef(null)

  // Update slider when the hour index changes
  useEffect(() => {
    setSliderValue(currentHourIndex)
  }, [currentHourIndex])

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const updateTooltipPosition = (value) => {
    const slider = sliderRef.current
    const tooltip = tooltipRef.current
    if (!slider || !tooltip) return

    tooltip.textContent = value < 10 ? `0${value}:00` : `${value}:00`

    const min = parseInt(slider.min)
    const max = parseInt(slider.max)
    const rangeWidth = slider.offsetWidth
    const thumbWidth = 16
    const percentage = (value - min) / (max - min)
    const tooltipOffset = (rangeWidth - thumbWidth) * percentage + thumbWidth / 2

    tooltip.style.left = `${tooltipOffset}px`
  }

  useEffect(() => {
    updateTooltipPosition(sliderValue)
  }, [sliderValue])

  // Handle slider input change
  const handleInput = (e) => {
    const value = Number(e.target.value)
    setSliderValue(value) // Move thumb & tooltip
  }

  // Apply slider value when input is released (commit the value)
  const commitSliderValue = () => {
    setCurrentHourIndex(sliderValue)
  }

  useEffect(() => {
    // Automatically play/pause the slider
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSliderValue((prev) => {
          const next = prev < 23 ? prev + 1 : 0 // Loop back to 0
          setCurrentHourIndex(next) // Sync with parent
          return next // Update local value
        })
      }, 1000) // Update every second
    } else {
      clearInterval(intervalRef.current) // Clear interval when paused
    }

    return () => clearInterval(intervalRef.current)
  }, [isPlaying, setCurrentHourIndex])

  return (
    <div className='slider-container'>
      <button id='play-pause-btn' onClick={togglePlayPause}>
        <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
      </button>
      <div className='slider'>
        <input
          type='range'
          id='datetime-range'
          ref={sliderRef}
          min='1'
          max='24'
          step='1'
          value={sliderValue}
          onInput={handleInput} // Move thumb & tooltip on input
          onMouseUp={commitSliderValue} // Commit value on mouse up
          onTouchEnd={commitSliderValue} // Commit value on touch end
        />
        <span id='tooltip' ref={tooltipRef}>
          {sliderValue < 10 ? `0${sliderValue}:00` : `${sliderValue}:00`}
        </span>
      </div>
    </div>
  )
}
