import { useAllRain } from '@/hooks/useRainQuery'
import { classifyRainColor } from '@/utils/classify'
import { formatRainData } from '@/utils/format'
import { useFilterStore, useMapStore } from '@/zustand/store'
import { control, DomUtil } from 'leaflet'
import { memo, useEffect, useMemo, useState } from 'react'
import { CircleMarker, Popup, useMap } from 'react-leaflet'
import { ChartModal } from '../chart/ChartModal'

export const RainMap = () => {
  // console.log('RainMap rendered')
  const map = useMap()
  const [selectedStation, setSelectedStation] = useState(null)

  const { startDateTime, endDateTime } = useFilterStore()
  const { data } = useAllRain(startDateTime, endDateTime)

  const rainData = useMemo(() => {
    return data ? formatRainData(data) : []
  }, [data])

  useEffect(() => {
    const legend = control({ position: 'topright' })
    legend.onAdd = function () {
      const div = DomUtil.create('div', 'legend')
      div.innerHTML += '<h4>Chú giải</h4>'
      div.innerHTML += `
        <div class="legend-gradient" style="background: linear-gradient(to right, #ff0000, #ff9900, #66cc66, #3399ff, #808080, #D3D3D3)">
          <div class="legend-item" title="Mưa rất to (mưa > 100 mm)"></div>
          <div class="legend-item" title="Mưa to (mưa từ 51 – 100 mm)"></div>
          <div class="legend-item" title="Mưa vừa (mưa từ 16 – 50 mm)"></div>
          <div class="legend-item" title="Mưa nhỏ (mưa < 16 mm)"></div>
          <div class="legend-item" title="Không mưa"></div>
          <div class="legend-item" title="Không có dữ liệu"></div>
        </div>
      `
      return div
    }
    legend.addTo(map)
    return () => legend.remove()
  }, [map])

  return (
    <>
      <MemoizedMarkerLayer
        rainData={rainData}
        onViewChart={(stationId) => {
          const fullStation = rainData.find((s) => s.stationId === stationId)
          setSelectedStation(fullStation)
        }}
      />
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

export const MarkerLayer = ({ rainData, onViewChart }) => {
  // console.log('MarkerLayer rendered')
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)

  const updatedMarkers = useMemo(() => {
    return rainData.map(({ hourlyData, ...station }) => {
      const value = Object.entries(hourlyData)[currentHourIndex - 1]?.[1] || 0
      return {
        ...station,
        rainValue: parseFloat(value)
      }
    })
  }, [rainData, currentHourIndex])

  return (
    <>
      {updatedMarkers.map((station) => (
        <RainMarker
          key={`${station.stationId}-${station.lat}-${station.long}`}
          station={station}
          onViewChart={onViewChart}
        />
      ))}
    </>
  )
}

const MemoizedMarkerLayer = memo(MarkerLayer)

const RainMarker = memo(
  ({ station, onViewChart }) => {
    // console.log(`Rendering marker for ${station.stationId} with rainValue ${station.rainValue}`)
    const { color, fillColor, fillOpacity, weight } = classifyRainColor(station.rainValue)

    return (
      <CircleMarker
        key={`${station.stationId}-${station.lat}-${station.long}`}
        center={[station.lat, station.long]}
        pathOptions={{ radius: 4, color, fillColor, fillOpacity, weight }}
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
                <td className='text-nowrap fw-bold'>Dự án</td>
                <td>{station.stationTypeId}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Tổng lượng mưa</td>
                <td>{station.rainValue > 0 ? `${station.rainValue} mm` : 'Không có dữ liệu'}</td>
              </tr>
            </tbody>
          </table>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              onViewChart(station.stationId)
            }}
            className='text-primary text-decoration-underline'
          >
            Xem biểu đồ
          </a>
        </Popup>
      </CircleMarker>
    )
  },
  (prevProps, nextProps) => prevProps.station.rainValue === nextProps.station.rainValue
)
