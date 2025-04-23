import { useAllRain } from '@/hooks/useRainQuery'
import { getRainColor } from '@/utils/classify'
import { getStartAndEndTime } from '@/utils/helper'
import { control, DomUtil } from 'leaflet'
import { memo, useEffect, useMemo, useState } from 'react'
import { CircleMarker, Popup, useMap } from 'react-leaflet'
import { ChartModal } from '../common/ChartModal'
import { formatRainData } from '@/utils/format'

export const RainMap = ({ currentHourIndex }) => {
  const [selectedStation, setSelectedStation] = useState(null)
  const map = useMap()

  const { startDateTime, endDateTime } = getStartAndEndTime(new Date())

  const { data } = useAllRain(startDateTime, endDateTime)

  const rainData = useMemo(() => {
    return data ? formatRainData(data) : []
  }, [data])
  
  const hourlyRainData = useMemo(() => {
    return rainData.map((station) => {
      const value = Object.entries(station.hourlyData)[currentHourIndex - 1]?.[1] || 0
      return { ...station, rainValue: parseFloat(value) }
    })
  }, [rainData, currentHourIndex])

  // Add legend (runs once)
  useEffect(() => {
    const legend = control({ position: 'topright' })

    legend.onAdd = function () {
      const div = DomUtil.create('div', 'legend')
      div.innerHTML += '<h4>Chú giải</h4>'
      div.innerHTML += `
        <div className="legend-gradient" style="background: linear-gradient(to right, #ff0000, #ff9900, #66cc66, #3399ff, #808080, #D3D3D3)">
          <div className="legend-item" title="Mưa rất to (mưa > 100 mm)"></div>
          <div className="legend-item" title="Mưa to (mưa từ 51 – 100 mm)"></div>
          <div className="legend-item" title="Mưa vừa (mưa từ 16 – 50 mm)"></div>
          <div className="legend-item" title="Mưa nhỏ (mưa < 16 mm)"></div>
          <div className="legend-item" title="Không mưa"></div>
          <div className="legend-item" title="Không có dữ liệu"></div>
        </div>
      `
      return div
    }

    legend.addTo(map)
    return () => legend.remove()
  }, [map])

  return (
    <>
      <MemoizedMarkerLayer data={hourlyRainData} onViewChart={setSelectedStation} />
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

const MarkerLayer = ({ data, onViewChart }) => {
  return (
    <>
      {data.map((station, index) => {
        const { color, fillColor, fillOpacity, weight } = getRainColor(station.rainValue)
        return (
          <CircleMarker
            key={index}
            center={[station.lat, station.long]}
            pathOptions={{ color, fillColor, fillOpacity, radius: 4, weight }}
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
          </CircleMarker>
        )
      })}
    </>
  )
}

const MemoizedMarkerLayer = memo(MarkerLayer)
