import { WATER_LEVEL } from '@/constants'
import { useAllWaterLevel } from '@/hooks/useWaterLevelQuery'
import { getRainColor } from '@/utils/classify'
import { formatWaterLevelData } from '@/utils/format'
import { getStartAndEndTime } from '@/utils/helper'
import { control, DomUtil } from 'leaflet'
import { memo, useEffect, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'

export const WaterLevelMap = ({ currentHourIndex }) => {
  const map = useMap()
  const [selectedStation, setSelectedStation] = useState(null)

  const { startDateTime, endDateTime } = getStartAndEndTime(new Date())
  const { data } = useAllWaterLevel(startDateTime, endDateTime)

  const waterLevelData = useMemo(() => {
    return data ? formatWaterLevelData(data) : []
  }, [data])
  console.log("🚀 ~ waterLevelData ~ waterLevelData:", waterLevelData)

  const hourlyWLData = useMemo(() => {
    return waterLevelData.map((station) => {
      const value = station.hourlyData ? Object.entries(station.hourlyData)[currentHourIndex - 1]?.[1] : 0

      return {
        ...station,
        rainValue: parseFloat(value) || 0
      }
    })
  }, [waterLevelData, currentHourIndex])

  useEffect(() => {
    const legend = control({ position: 'topright' })

    legend.onAdd = function () {
      const div = DomUtil.create('div', 'legend')
      div.innerHTML += '<h4>Chú giải</h4>'
      div.innerHTML += `
        <div class="legend-grid">
          <div class="legend-item" title="Dưới BDD1 hoặc trạm tự động ">
            <img src=${WATER_LEVEL.IMG_BLUEFLAG} alt="Dưới BDD1" height="20" width="20" />
          </div>
          <div class="legend-item" title="Trạm đạt mức BĐ1">
            <img src=${WATER_LEVEL.IMG_BD1} alt="BĐ1" height="20" width="20" />
          </div>
          <div class="legend-item" title="Trạm đạt mức BĐ2 ">
            <img src=${WATER_LEVEL.IMG_BD2} alt="BĐ2" height="25" width="25" />
          </div>
          <div class="legend-item" title="Trạm đạt mức BĐ3 ">
            <img src=${WATER_LEVEL.IMG_BD3} alt="BĐ3" height="25" width="25" />
          </div>
        </div>
        `
      return div
    }

    legend.addTo(map)
    return () => legend.remove()
  }, [map])

  return (
    <>
      {/* <MemoizedMarkerLayer data={hourlyWLData} onViewChart={setSelectedStation} /> */}
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

export const MarkerLayer = ({ data, onViewChart }) => {
  return (
    <>
      {data.map((station) => {
        const { color, fillColor, fillOpacity, weight } = getRainColor(station.rainValue)

        return (
          <CircleMarker
            key={station.stationId}
            center={[station.lat, station.long]}
            pathOptions={{
              radius: 4,
              color,
              fillColor,
              fillOpacity,
              weight
            }}
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
