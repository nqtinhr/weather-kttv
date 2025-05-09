import { useMapStore } from '@/zustand/store'
import { useEffect, useRef, useState } from 'react'
import './Slider.css'

export const Slider = () => {
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)
  const setCurrentHourIndex = useMapStore((state) => state.setCurrentHourIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sliderValue, setSliderValue] = useState(currentHourIndex)

  const intervalRef = useRef(null)
  const sliderRef = useRef(null)
  const tooltipRef = useRef(null)

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

  const handleInput = (e) => {
    setSliderValue(Number(e.target.value)) // Local update only
  }

  const commitSliderValue = () => {
    setCurrentHourIndex(sliderValue) // Update parent
  }

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSliderValue((prev) => {
          const next = prev < 24 ? prev + 1 : 1
          setCurrentHourIndex(next)
          return next
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
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
          onInput={handleInput}
          onMouseUp={commitSliderValue}
          onTouchEnd={commitSliderValue}
        />
        <span id='tooltip' ref={tooltipRef}>
          {sliderValue < 10 ? `0${sliderValue}:00` : `${sliderValue}:00`}
        </span>
      </div>
    </div>
  )
}
