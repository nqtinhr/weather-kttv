import { useAllWind } from '@/hooks/useWindQuery'
import { classifyPressureColor } from '@/utils/classify'
import { formatPressureData } from '@/utils/format'
import { getStartAndEndTime } from '@/utils/helper'
import { useMapStore } from '@/zustand/store'
import { control, DomUtil } from 'leaflet'
import { memo, useEffect, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'

export const PressureMap = () => {
  const [selectedStation, setSelectedStation] = useState(null)

  const map = useMap()
  const { startDateTime, endDateTime } = getStartAndEndTime(new Date())
  const { data } = useAllWind(startDateTime, endDateTime)

  const pressureData = useMemo(() => {
    return data ? formatPressureData(data) : []
  }, [data])
  console.log('🚀 ~ pressureData ~ pressureData:', pressureData)

  useEffect(() => {
    const legend = control({ position: 'topright' })
    legend.onAdd = function () {
      const div = DomUtil.create('div', 'legend')
      div.innerHTML += '<h4>Chú giải</h4>'
      div.innerHTML += `
        <div class="legend-gradient" style="background: linear-gradient(to right, #6B8EFA, #F4A261);">
            <div class="legend-item" title="Độ ẩm trên 1000"></div>
            <div class="legend-item" title="Độ ẩm dưới 1000"></div>
        </div>`;
      return div
    }
    legend.addTo(map)
    return () => legend.remove()
  }, [map])

  return (
    <>
      <MemoizedMarkerLayer pressureData={pressureData} onViewChart={setSelectedStation} />
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

export const MarkerLayer = ({ pressureData, onViewChart }) => {
  // console.log('MarkerLayer rendered')
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)

  const updatedMarkers = useMemo(() => {
    return pressureData.map(({ hourlyData, ...station }) => {
      const value = Object.entries(hourlyData)[currentHourIndex - 1]?.[1] || 0
      return {
        ...station,
        value: parseFloat(value)
      }
    })
  }, [pressureData, currentHourIndex])

  return (
    <>
      {updatedMarkers.map((station) => (
        <PressureMarker
          key={`${station.stationId}-${station.lat}-${station.long}`}
          station={station}
          onViewChart={onViewChart}
        />
      ))}
    </>
  )
}

const MemoizedMarkerLayer = memo(MarkerLayer)

const PressureMarker = memo(
  ({ station, onViewChart }) => {
    const { color, fillColor } = classifyPressureColor(station.rainValue)

    return (
      <CircleMarker
        key={`${station.stationId}-${station.lat}-${station.long}`}
        center={[station.lat, station.long]}
        pathOptions={{ radius: 4, color, fillColor, fillOpacity: 1, weight: 1 }}
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
                <td className='text-nowrap fw-bold'>Áp suất</td>
                <td>{station.value}</td>
              </tr>
            </tbody>
          </table>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              onViewChart(station)
            }}
            className='text-primary text-decoration-underline'
          >
            Xem biểu đồ
          </a>
        </Popup>
      </CircleMarker>
    )
  },
  (prevProps, nextProps) => prevProps.station.value === nextProps.station.value
)
