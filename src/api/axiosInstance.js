import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.1.31:1221/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors
// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    return JSON.parse(response.data); 
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
