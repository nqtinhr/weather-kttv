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
