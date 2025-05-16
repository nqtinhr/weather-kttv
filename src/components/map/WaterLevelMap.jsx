import { WATER_LEVEL_URL } from '@/constants/image'
import { useAllWaterLevel } from '@/hooks/useWaterLevelQuery'
import { classifyWaterLevelWarning } from '@/utils/classify'
import { formatWaterLevelData } from '@/utils/format'
import { getStartAndEndTime } from '@/utils/helper'
import { useMapStore } from '@/zustand/store'
import { control, DomUtil, icon } from 'leaflet'
import { memo, useEffect, useMemo, useState } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import { ChartModal } from '../chart/ChartModal'

export const WaterLevelMap = () => {
  console.log('WaterLevelMap rendered')
  const map = useMap()
  const [selectedStation, setSelectedStation] = useState(null)

  const { startDateTime, endDateTime } = getStartAndEndTime(new Date())
  const { data } = useAllWaterLevel(startDateTime, endDateTime)

  const waterLevelData = useMemo(() => {
    return data ? formatWaterLevelData(data) : []
  }, [data])

  useEffect(() => {
    const legend = control({ position: 'topright' })

    legend.onAdd = function () {
      const div = DomUtil.create('div', 'legend')
      div.innerHTML += '<h4>Chú giải</h4>'
      div.innerHTML += `
        <div class="legend-grid">
          <div class="legend-item" title="Dưới BDD1 hoặc trạm tự động ">
            <img src=${WATER_LEVEL_URL.IMG_BLUEFLAG} alt="Dưới BDD1" height="20" width="20" />
          </div>
          <div class="legend-item" title="Trạm đạt mức BĐ1">
            <img src=${WATER_LEVEL_URL.IMG_BD1} alt="BĐ1" height="20" width="20" />
          </div>
          <div class="legend-item" title="Trạm đạt mức BĐ2 ">
            <img src=${WATER_LEVEL_URL.IMG_BD2} alt="BĐ2" height="25" width="25" />
          </div>
          <div class="legend-item" title="Trạm đạt mức BĐ3 ">
            <img src=${WATER_LEVEL_URL.IMG_BD3} alt="BĐ3" height="25" width="25" />
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
      <MemoizedMarkerLayer
        waterLevelData={waterLevelData}
        onViewChart={(stationId) => {
          const fullStation = waterLevelData.find((s) => s.stationId === stationId)
          setSelectedStation(fullStation)
        }}
      />
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

export const MarkerLayer = ({ waterLevelData, onViewChart }) => {
  // console.log('MarkerLayer rendered')
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)

  const updatedMarkers = useMemo(() => {
    return waterLevelData
      .map(({ hourlyData, ...station }) => {
        const entry = Object.entries(hourlyData)[currentHourIndex - 1]
        if (!entry) return null

        const value = parseFloat(entry[1])
        if (isNaN(value)) return null

        return {
          ...station,
          value
        }
      })
      .filter(Boolean) // loại bỏ null
  }, [waterLevelData, currentHourIndex])

  return (
    <>
      {updatedMarkers.map((station) => (
        <WaterLevelMarker
          key={`${station.stationId}-${station.lat}-${station.long}`}
          station={station}
          onViewChart={onViewChart}
        />
      ))}
    </>
  )
}

const MemoizedMarkerLayer = memo(MarkerLayer)

const WaterLevelMarker = memo(
  ({ station, onViewChart }) => {
    const { iconUrl, iconSize } = classifyWaterLevelWarning(station.value, station.warnings)

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
                <td className='text-nowrap fw-bold'>Báo động 1</td>
                <td>{!station.warnings.level1 ? 'Không có dữ liệu' : station.warnings.level1}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Báo động 2</td>
                <td>{!station.warnings.level2 ? 'Không có dữ liệu' : station.warnings.level2}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Báo động 3</td>
                <td>{!station.warnings.level3 ? 'Không có dữ liệu' : station.warnings.level3}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Lũ lịch sử</td>
                <td>
                  {station.history.year === 0 && station.history.maxLevel === 0
                    ? 'Không có dữ liệu'
                    : `Năm ${station.history.year} đạt mức ${station.history.maxLevel}`}
                </td>
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
              onViewChart(station.stationId)
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
