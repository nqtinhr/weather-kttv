import { useProvincesById } from '@/hooks/useProvinceQuery'
import { useRainForm } from '@/hooks/useRainQuery'
import { useAllRegion } from '@/hooks/useRegionQuery'
import { formatRainData } from '@/utils/format'
import { getStartAndEndTime } from '@/utils/helper'
import { useState } from 'react'

const RainForm = () => {
  const [region, setRegion] = useState('')
  const [province, setProvince] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const { data: regions = [] } = useAllRegion()
  const { data: provinces = [] } = useProvincesById(region)
  

  const rainMutation = useRainForm()

  const handleRegionChange = (e) => {
    const regionId = e.target.value
    setRegion(regionId)
    setProvince('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { startDateTime, endDateTime } = getStartAndEndTime(new Date(date))

    rainMutation.mutate(
      { region, startDateTime, endDateTime },
      {
        onSuccess: (data) => {
          const formatted = formatRainData(data)
          console.log('Dữ liệu mưa đã xử lý:', formatted)
          // Bạn có thể lưu vào state nếu cần
        },
        onError: (error) => {
          console.error('Lỗi khi gọi API:', error)
        }
      }
    )
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div className='form-group mb-2'>
        <label className='form-label'>Vùng:</label>
        <select className='form-select' value={region} onChange={handleRegionChange}>
          <option value=''>-- Chọn vùng --</option>
          {regions.map((r) => (
            <option key={r.ID} value={r.ID}>
              {r.RegName}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group mb-2'>
        <label className='form-label'>Tỉnh:</label>
        <select className='form-select' value={province} onChange={(e) => setProvince(e.target.value)}>
          <option value=''>-- Chọn tỉnh --</option>
          {provinces.map((p) => (
            <option key={p.ProvinceID} value={p.ProvinceName}>
              {p.ProvinceName}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group mb-2'>
        <label className='form-label'>Thời gian:</label>
        <input type='date' className='form-control' value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className='d-flex justify-content-center'>
        <button type='submit' className='btn btn-primary'>
          Tìm kiếm
        </button>
      </div>
    </form>
  )
}

export default RainForm
