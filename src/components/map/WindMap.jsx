import { useAllWind } from '@/hooks/useWindQuery'
import { formatWindData } from '@/utils/format'
import { getStartAndEndTime } from '@/utils/helper'
import { useMapStore } from '@/zustand/store'
import { memo, useMemo, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { ChartModal } from '../chart/ChartModal'
import { createWindBarbIcon } from '@/utils/winbarb'

export const WindMap = () => {
  const [selectedStation, setSelectedStation] = useState(null)

  const { startDateTime, endDateTime } = getStartAndEndTime(new Date())
  const { data } = useAllWind(startDateTime, endDateTime)

  const windData = useMemo(() => {
    return data ? formatWindData(data) : []
  }, [data])

  return (
    <>
      <MemoizedMarkerLayer
        windData={windData}
        onViewChart={(stationId) => {
          const fullStation = windData.find((s) => s.stationId === stationId)
          setSelectedStation(fullStation)
        }}
      />
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

export const MarkerLayer = ({ windData, onViewChart }) => {
  // console.log('MarkerLayer rendered')
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)

  const updatedMarkers = useMemo(() => {
    return windData
      .map(({ hourlyData, ...station }) => {
        const entry = Object.entries(hourlyData)[currentHourIndex - 1]
        if (!entry) return null

        const rawValue = entry[1]
        if (!rawValue || typeof rawValue !== 'string') return null

        const [ddStr, ffStr] = rawValue.split(':')
        const dd = parseFloat(ddStr)
        const ff = parseFloat(ffStr)

        return {
          ...station,
          dd,
          ff
        }
      })
      .filter(Boolean) // loại bỏ null
  }, [windData, currentHourIndex])

  return (
    <>
      {updatedMarkers.map((station) => (
        <WindMarker
          key={`${station.stationId}-${station.lat}-${station.long}`}
          station={station}
          onViewChart={onViewChart}
        />
      ))}
    </>
  )
}

const MemoizedMarkerLayer = memo(MarkerLayer)

const WindMarker = memo(
  ({ station, onViewChart }) => {
    return (
      <Marker
        key={`${station.stationId}-${station.lat}-${station.long}`}
        position={[station.lat, station.long]}
        icon={createWindBarbIcon({ deg: Math.round(station.dd ?? 0), speed: Math.round(station.ff ?? 0) * 1.94 })}
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
                <td className='text-nowrap fw-bold'>Hướng gió giật:</td>
                <td>{station.dxDx}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Tốc độ gió giật:</td>
                <td>{station.fxFx}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Tốc độ gió:</td>
                <td>{station.ff + ' m/s'}</td>
              </tr>
              <tr>
                <td className='text-nowrap fw-bold'>Hướng gió:</td>
                <td>{station.dd + ' °'}</td>
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
