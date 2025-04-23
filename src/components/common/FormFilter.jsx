import { useEffect, useRef, useState } from 'react'
import './FormFilter.css'
import RainForm from '../form/RainForm'

export const FormFilter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const formRef = useRef(null)

  const toggleForm = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target) && !event.target.closest('#toggle-btn')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <>
      {!isOpen && (
        <div id='toggle-btn' onClick={toggleForm}>
          <i className='fas fa-bars'></i>
        </div>
      )}

      <div className={`filter-form ${isOpen ? 'active' : 'hidden'}`} ref={formRef}>
        <div id='close-btn' onClick={toggleForm}>
          <i className='fas fa-times'></i>
        </div>
        <RainForm />
      </div>
    </>
  )
}
