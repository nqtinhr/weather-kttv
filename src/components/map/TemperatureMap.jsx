import { useAllTemperature } from '@/hooks/useTemperatureQuery'
import { classifyTemperature } from '@/utils/classify'
import { formatTemperatureData } from '@/utils/format'
import { getStartAndEndTime } from '@/utils/helper'
import { useMapStore } from '@/zustand/store'
import { control, DomUtil, icon } from 'leaflet'
import { memo, useEffect, useMemo, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'

export const TemperatureMap = () => {
  const [selectedStation, setSelectedStation] = useState(null)
  const map = useMap()

  const { startDateTime, endDateTime } = getStartAndEndTime(new Date())
  const { data } = useAllTemperature(startDateTime, endDateTime)

  const temperatureData = useMemo(() => {
    return data ? formatTemperatureData(data) : []
  }, [data])

  useEffect(() => {
    const legend = control({ position: 'topright' })

    legend.onAdd = function () {
      const div = DomUtil.create('div', 'legend')
      div.innerHTML += '<h4>Chú giải</h4>'
      div.innerHTML += `
      <div class="legend-gradient" style="background: linear-gradient(to right, #228B22, #32CD32, #0033cc, #00868B, #FF4500, #C60000, #8B0000);">
          <div class="legend-item" title="Nhiệt độ: <= 13°C"></div>
          <div class="legend-item" title="Nhiệt độ từ: 14°C - 15°C"></div>
          <div class="legend-item" title="Nhiệt độ từ: 16°C - 20°C"></div>
          <div class="legend-item" title="Nhiệt độ từ: 21°C - 25°C"></div>
          <div class="legend-item" title="Nhiệt độ từ: 26°C - 30°C"></div>
          <div class="legend-item" title="Nhiệt độ từ: 31°C - 34°C"></div>
          <div class="legend-item" title="Nhiệt độ từ: 35°C - 36°C"></div>
          <div class="legend-item" title="Nhiệt độ từ: 37°C - 38°C"></div>
          <div class="legend-item" title="Nhiệt độ: >= 39°C"></div>
      </div>`
      return div
    }

    legend.addTo(map)
    return () => legend.remove()
  }, [map])

  return (
    <>
      <MemoizedMarkerLayer temperatureData={temperatureData} onViewChart={setSelectedStation} />
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

export const MarkerLayer = ({ temperatureData, onViewChart }) => {
  // console.log('MarkerLayer rendered')
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)

  const updatedMarkers = useMemo(() => {
    return temperatureData
      .map(({ hourlyData, ...station }) => {
        const hourEntries = Object.entries(hourlyData)
        const entry = hourEntries[currentHourIndex - 1]
        if (!entry) return null

        const value = parseFloat(entry[1])
        if (isNaN(value)) return null

        return {
          ...station,
          value
        }
      })
      .filter(Boolean) // Loại bỏ các phần tử null
  }, [temperatureData, currentHourIndex])

  return (
    <>
      {updatedMarkers.map((station) => (
        <TemperatureMarker
          key={`${station.stationId}-${station.lat}-${station.long}`}
          station={station}
          onViewChart={onViewChart}
        />
      ))}
    </>
  )
}

const MemoizedMarkerLayer = memo(MarkerLayer)

const TemperatureMarker = memo(
  ({ station, onViewChart }) => {
    const { iconUrl, iconSize } = classifyTemperature(station.value)
    return (
      <Marker
        key={`${station.stationId}-${station.lat}-${station.long}`}
        position={[station.lat, station.long]}
        icon={icon({ iconUrl, iconSize })}
      >
        <Popup>
          <table className='table table-bordered table-striped table-sm'>
            <thead>
              <tr>
                <th colSpan='2' className='text-center'>
                  Thông tin dữ liệu
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='text-nowrap fw-bold'>Mã trạm</td>
                <td>{station.stationId}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Tên trạm</td>
                <td>{station.stationName}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Địa chỉ</td>
                <td>{station.address}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Thời gian</td>
                <td>{station.stationTypeId}</td>
              </tr>
              <tr>
                <td class='text-nowrap'>
                  <strong>Nhiệt độ:</strong>
                </td>
                <td>{!station.value ? 'Không có dữ liệu' : station.value + '°C'}</td>
              </tr>
            </tbody>
          </table>
          <a
            href='#'
            className='text-primary text-decoration-underline'
            data-bs-toggle='modal'
            data-bs-target={`#modal-${station.stationId}`}
            onClick={(e) => {
              e.preventDefault()
              onViewChart(station)
            }}
          >
            Xem biểu đồ
          </a>
        </Popup>
      </Marker>
    )
  },
  (prevProps, nextProps) => prevProps.station.value === nextProps.station.value
)
