import { useEffect, useRef, useState } from 'react'
import './FormFilter.css'
import { RainForm } from './RainForm'
import { useSearchParams } from 'react-router-dom'
import { DefaultForm } from './DefaultForm'
import { RAIN } from '@/constants/common'

export const FormFilter = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
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

  const renderFormByType = () => {
    switch (type) {
      case RAIN:
        return <RainForm />
      default:
        return <DefaultForm />
    }
  }

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
        {renderFormByType()}
      </div>
    </>
  )
}
