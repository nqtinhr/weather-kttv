import { useMapStore } from '@/zustand/store'
import React, { memo, useMemo } from 'react'

const MarkerLayer = ({ data, onViewChart, children }) => {
  const currentHourIndex = useMapStore((state) => state.currentHourIndex)

  const updatedMarkers = useMemo(() => {
    return data.map(({ hourlyData, ...station }) => {
      const value = Object.entries(hourlyData)[currentHourIndex - 1]?.[1] || 0
      return {
        ...station,
        value: parseFloat(value)
      }
    })
  }, [data, currentHourIndex])
  console.log("🚀 ~ updatedMarkers ~ updatedMarkers:", updatedMarkers)

  return (
    <>
      {updatedMarkers.map((station) => {
        return React.cloneElement(children, {
          key: `${station.stationId}-${station.lat}-${station.long}`,
          station,
          onViewChart
        })
      })}
    </>
  )
}

const MemoizedMarkerLayer = memo(MarkerLayer)

export default MemoizedMarkerLayer
