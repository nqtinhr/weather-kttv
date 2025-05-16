import { useProvincesById } from '@/hooks/useProvinceQuery'
import { useRainForm } from '@/hooks/useRainQuery'
import { useAllRegion } from '@/hooks/useRegionQuery'
import { getStartAndEndTime } from '@/utils/helper'
import { useFilterStore } from '@/zustand/store'
import { useState } from 'react'
import './DefaultForm.css'
import { useNavigate } from 'react-router-dom'

export const RainForm = ({ layout = 'vertical' }) => {
  const isHorizontal = layout === 'horizontal'
  const [region, setRegion] = useState('')
  const [province, setProvince] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const setFilters = useFilterStore((s) => s.setFilters)

  const navigate = useNavigate()

  const { data: regions = [] } = useAllRegion()
  const { data: provinces = [] } = useProvincesById(region)
  const rainMutation = useRainForm()

  const handleRegionChange = (e) => {
    const regionId = e.target.value
    setRegion(regionId)
    setProvince('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { startDateTime, endDateTime } = getStartAndEndTime(new Date(date))
    const params = new URLSearchParams()

    params.set('start', startDateTime)
    params.set('end', endDateTime)
    navigate(`?type=rain&${params.toString()}`)
    
    setFilters({ region, startDateTime, endDateTime })
  }

  return (
    <form
      className={`form ${isHorizontal ? 'form-horizontal d-flex align-items-end flex-wrap gap-3' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={`form-group ${isHorizontal ? 'd-flex align-items-center gap-2' : 'mb-2'}`}>
        <label className='form-label'>Vùng:</label>
        <select
          className='form-select'
          value={region}
          onChange={handleRegionChange}
          style={isHorizontal ? { width: '200px' } : {}}
        >
          <option value=''>-- Chọn vùng --</option>
          {regions.map((r) => (
            <option key={r.ID} value={r.ID}>
              {r.RegName}
            </option>
          ))}
        </select>
      </div>

      <div className={`form-group ${isHorizontal ? 'd-flex align-items-center gap-2' : 'mb-2'}`}>
        <label className='form-label'>Tỉnh:</label>
        <select
          className='form-select'
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          style={isHorizontal ? { width: '200px' } : {}}
        >
          <option value=''>-- Chọn tỉnh --</option>
          {provinces.map((p) => (
            <option key={p.ProvinceID} value={p.ProvinceName}>
              {p.ProvinceName}
            </option>
          ))}
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

      {/* Button */}
      <div className={`${isHorizontal ? 'd-flex align-items-center gap-2' : 'd-flex justify-content-center mt-3'}`}>
        <button type='submit' className='btn btn-primary' disabled={rainMutation?.isPending}>
          Tìm kiếm{' '}
          {rainMutation?.isPending && (
            <span className='spinner-border spinner-border-sm text-light ms-1' role='status' />
          )}
        </button>
      </div>
    </form>
  )
}
