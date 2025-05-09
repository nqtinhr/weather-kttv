import { useAllWind } from '@/hooks/useWindQuery'
import { formatWindData } from '@/utils/format'
import { getStartAndEndTime } from '@/utils/helper'
import { useMapStore } from '@/zustand/store'
import { memo, useMemo, useState } from 'react'

export const WindMap = () => {
  const [selectedStation, setSelectedStation] = useState(null)

  const { startDateTime, endDateTime } = getStartAndEndTime(new Date())
  const { data } = useAllWind(startDateTime, endDateTime)

  const windData = useMemo(() => {
    return data ? formatWindData(data) : []
  }, [data])
  console.log('🚀 ~ windData ~ windData:', windData)

  return (
    <>
      {/* <MemoizedMarkerLayer windData={windData} onViewChart={setSelectedStation} /> */}
      {selectedStation && <ChartModal station={selectedStation} onClose={() => setSelectedStation(null)} />}
    </>
  )
}

export const MarkerLayer = ({ windData, onViewChart }) => {
  // console.log('MarkerLayer rendered')
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)

  const updatedMarkers = useMemo(() => {
    return windData.map(({ hourlyData, ...station }) => {
      const value = Object.entries(hourlyData)[currentHourIndex - 1]?.[1] || 0
      return {
        ...station,
        value: parseFloat(value)
      }
    })
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
      <Marker key={`${station.stationId}-${station.lat}-${station.long}`} position={[station.lat, station.long]}>
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
              {/* <tr>
                <td class='text-nowrap fw-bold'>Hướng gió giật:</td>
                <td>{}</td>
              </tr>
              <tr>
                <td class='text-nowrap fw-bold'>Tốc độ gió giật:</td>
                <td>{}</td>
              </tr> */}
              <tr>
                <td class='text-nowrap fw-bold'>Tốc độ gió:</td>
                <td>{station.fxFx}</td>
              </tr>
              <tr>
                <td class='text-nowrap fw-bold'>Hướng gió:</td>
                <td>{station.dxDx}</td>
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
