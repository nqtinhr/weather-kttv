import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.31:1221/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return JSON.parse(response.data); 
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
