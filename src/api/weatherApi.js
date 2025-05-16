import axiosInstance from './axiosInstance'

const weatherApi = {
  getRainByAllTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetRain1h4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getRainByTimeRange(regId, startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetRain1h4WebByTimeRange/${regId}/${startDateTime}/${endDateTime}`)
  },

  getWaterLevelByAllTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetWL4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getTemperatureByAllTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetT2m4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getWindByAllTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetWind10m4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getHumidityByAllTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetRh2m4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getPressureByAllTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetPS4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getAllRegion() {
    return axiosInstance.get(`/api/GetAllRegCentre`)
  },

  getProvincesById(provinceId) {
    return axiosInstance.get(`/api/getAllProvince/${provinceId}`)
  },

  getTimeseriesRain1h(stationId, startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetTimeseriesRain1h/${stationId}/${startDateTime}/${endDateTime}`)
  },
  getTimeseriesWaterLevel(stationId, startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetTimeseriesWL/${stationId}/${startDateTime}/${endDateTime}`)
  },
  getTimeseriesTemperature(stationId, startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetTimeseriesT2m/${stationId}/${startDateTime}/${endDateTime}`)
  },
  getTimeseriesWind10m(stationId, startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetTimeseriesWind10m/${stationId}/${startDateTime}/${endDateTime}`)
  },
}

export default weatherApi