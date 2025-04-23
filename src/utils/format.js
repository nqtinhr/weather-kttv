export function formatDateToYAFormat(date) {
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}00Z`
}

export const formatRainData = (data) => {
  return data.map((item) => {
    const { Longitude, Latitude, StationID, StationName, StationTypeID, address, total, ...hourlyData } = item
    return {
      lat: Latitude,
      long: Longitude,
      stationId: StationID,
      stationName: StationName,
      stationTypeId: StationTypeID,
      address,
      rainAmount: total,
      hourlyData
    }
  })
}