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

export const formatWaterLevelData = (data) => {
  return data.map((item) => {
    const { Longitude, Latitude, StationID, StationName, StationTypeID, address, Warning1, Warning2, Warning3, HistoryHMaxYear, HistoryHMax, ...hourlyData } = item

    return {
      lat: Latitude,
      long: Longitude,
      stationId: StationID,
      stationName: StationName,
      stationTypeId: StationTypeID,
      address,
      warnings: {
        level1: Warning1,
        level2: Warning2,
        level3: Warning3
      },
      history: {
        year: HistoryHMaxYear,
        maxLevel: HistoryHMax
      },
      hourlyData
    }
  })
}

export const formatWindData = (data) => {
  return data.map((item) => {
    const { Longitude, Latitude, StationID, StationName, StationTypeID, address, FxFx, DxDx, ...hourlyData } = item

    return {
      lat: Latitude,
      long: Longitude,
      stationId: StationID,
      stationName: StationName,
      stationTypeId: StationTypeID,
      address,
      fxFx: FxFx,
      dxDx: DxDx,
      hourlyData
    }
  })
}

export const formatTemperatureData = (data) => {
  return data.map((item) => {
    const { Longitude, Latitude, StationID, StationName, StationTypeID, address, ...hourlyData } = item
    return {
      lat: Latitude,
      long: Longitude,
      stationId: StationID,
      stationName: StationName,
      stationTypeId: StationTypeID,
      address,
      hourlyData
    }
  })
}

export const formatPressureData = (data) => {
  return data.map((item) => {
    const { Longitude, Latitude, StationID, StationName, StationTypeID, address, DxDx, FxFx, ...hourlyData } = item
    return {
      lat: Latitude,
      long: Longitude,
      stationId: StationID,
      stationName: StationName,
      stationTypeId: StationTypeID,
      address,
      dxDx: DxDx,
      fxFx: FxFx,
      hourlyData
    }
  })
}

export const formatHumidityData = (data) => {
  return data.map((item) => {
    const { Longitude, Latitude, StationID, StationName, StationTypeID, address, ...hourlyData } = item
    return {
      lat: Latitude,
      long: Longitude,
      stationId: StationID,
      stationName: StationName,
      stationTypeId: StationTypeID,
      address,
      hourlyData
    }
  })
}