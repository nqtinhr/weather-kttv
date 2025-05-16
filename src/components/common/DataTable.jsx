import { HUMIDITY, PRESSURE, RAIN, TEMPERATURE, WATER_LEVEL, WIND } from '@/constants/common'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useSensorDataByType } from '@/hooks/useSensorDataByType'
import {
  formatHumidityData,
  formatPressureData,
  formatRainData,
  formatTemperatureData,
  formatWaterLevelData,
  formatWindData
} from '@/utils/format'
import { useEffect, useMemo, useRef, useState } from 'react'
import './DataTable.css'

const PAGE_SIZE = 15 // Số dòng mỗi lần load thêm

export const DataTable = () => {
  const tableContainerRef = useRef(null)
  const { type, startDate, endDate } = useQueryParams()

  const getAdditionalColumn = () => {
    if (type === RAIN) return 'Tổng'
    if (type === WATER_LEVEL || type === TEMPERATURE) return 'Trung bình'
    return null
  }

  const additionalColumn = getAdditionalColumn()
  const [visibleRows, setVisibleRows] = useState(PAGE_SIZE)

  const { data } = useSensorDataByType(type, startDate, endDate)

  const formattedData = useMemo(() => {
    if (!data) return []
    switch (type) {
      case RAIN:
        return formatRainData(data)
      case WATER_LEVEL:
        return formatWaterLevelData(data)
      case TEMPERATURE:
        return formatTemperatureData(data)
      case WIND:
        return formatWindData(data)
      case HUMIDITY:
        return formatHumidityData(data)
      case PRESSURE:
        return formatPressureData(data)
      default:
        return []
    }
  }, [data, type])

  const dynamicKeys = useMemo(() => {
    const keySet = new Set()
    formattedData.forEach((station) => {
      Object.keys(station.hourlyData || {}).forEach((key) => keySet.add(key))
    })
    return Array.from(keySet).sort()
  }, [formattedData])

  // Infinite scroll
  const handleScroll = () => {
    const container = tableContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setVisibleRows((prev) => Math.min(prev + PAGE_SIZE, formattedData.length))
    }
  }

  useEffect(() => {
    const container = tableContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [formattedData])

  useEffect(() => {
    setVisibleRows(PAGE_SIZE)
  }, [formattedData])

  return (
    <div className='table-responsive' ref={tableContainerRef} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <table className='table custom-table table-bordered'>
        <thead>
          <tr>
            <th scope='col'>Mã trạm</th>
            <th scope='col'>Tên trạm</th>
            <th scope='col'>Địa chỉ</th>
            {dynamicKeys.map((key) => (
              <th key={key} scope='col'>
                {parseInt(key.slice(2))}h
              </th>
            ))}
            {additionalColumn && <th scope='col'>{additionalColumn}</th>}
          </tr>
        </thead>
        <tbody>
          {formattedData.slice(0, visibleRows).map((station) => {
            const { stationId, stationName, address, hourlyData = {} } = station

            const average =
              (type === WATER_LEVEL || type === TEMPERATURE) &&
              (() => {
                const validValues = dynamicKeys
                  .map((key) => parseFloat(hourlyData[key]))
                  .filter((val) => !isNaN(val) && val !== -9999)
                return validValues.length > 0
                  ? (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(2)
                  : ''
              })()

            return (
              <tr key={stationId}>
                <td>{stationId}</td>
                <td>{stationName}</td>
                <td>{address}</td>
                {dynamicKeys.map((key) => (
                  <td key={key}>{hourlyData[key] ?? ''}</td>
                ))}
                {type === RAIN && <td>{station.rainAmount}</td>}
                {(type === WATER_LEVEL || type === TEMPERATURE) && <td>{average}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>

      {visibleRows < formattedData.length && <div className='text-center my-2'>Đang tải thêm dữ liệu...</div>}
    </div>
  )
}
