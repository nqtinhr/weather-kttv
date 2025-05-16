import { CLIMATE, HUMIDITY, PRESSURE, RAIN, TEMPERATURE, WATER_LEVEL, WIND } from '@/constants/common'
import { getStartAndEndTime } from '@/utils/helper'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './DefaultForm.css'

export const DefaultForm = ({ layout = 'vertical' }) => {
  const isHorizontal = layout === 'horizontal'
  const [searchParams] = useSearchParams()
  const defaultType = searchParams.get('type') || RAIN
  const [type, setType] = useState(defaultType)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { startDateTime, endDateTime } = getStartAndEndTime(new Date(date))
    const params = new URLSearchParams()

    params.set('type', type)
    params.set('start', startDateTime)
    params.set('end', endDateTime)
    navigate(`?${params.toString()}`)
  }

  return (
    <form
      className={`form ${isHorizontal ? 'form-horizontal d-flex align-items-end flex-wrap gap-3 mb-3' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={`form-group ${isHorizontal ? 'd-flex align-items-center gap-2' : 'd-none'}`}>
        <label className='form-label'>Loại dữ liệu:</label>
        <select
          className='form-select'
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={isHorizontal ? { width: '200px' } : {}}
        >
          <option value={RAIN}>Lượng mưa</option>
          <option value={WATER_LEVEL}>Mực nước</option>
          <option value={TEMPERATURE}>Nhiệt độ</option>
          <option value={WIND}>Gió</option>
          <option value={HUMIDITY}>Độ ẩm</option>
          <option value={PRESSURE}>Áp suất</option>
          <option value={CLIMATE}>Khí hậu</option>
        </select>
      </div>
      <div className={`form-group ${isHorizontal ? 'd-flex align-items-center gap-2' : 'mb-2'}`}>
        <label className='form-label'>Thời gian:</label>
        <input
          type='date'
          className='form-control'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={isHorizontal ? { width: '200px' } : {}}
        />
      </div>

      <div className={`${isHorizontal ? 'd-flex align-items-center gap-2' : 'd-flex justify-content-center mt-3'}`}>
        <button type='submit' className='btn btn-primary'>
          Tìm kiếm
        </button>
      </div>
    </form>
  )
}
