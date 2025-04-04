import axiosInstance from './axiosInstance'

const weatherApi = {
  getRainByTimeRangeAll(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetRain1h4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getRainByRegionAndTimeRange(regId, startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetRain1h4WebByTimeRange/${regId}/${startDateTime}/${endDateTime}`)
  },

  getWaterLevelByTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetWL4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getTemperatureByTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetT2m4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getWindByTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetWind10m4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getHumidityByTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetRh2m4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getPressureByTimeRange(startDateTime, endDateTime) {
    return axiosInstance.get(`/api/GetPS4WebByTimeRange_All/${startDateTime}/${endDateTime}`)
  },

  getAllRegionalCenters() {
    return axiosInstance.get(`/api/GetAllRegCentre`)
  },

  getProvincesById(provinceId) {
    return axiosInstance.get(`/api/getAllProvince/${provinceId}`)
  }
}

export default weatherApi