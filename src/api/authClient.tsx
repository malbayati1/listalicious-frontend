import axios from "axios";

const API_BASE_URL = __DEV__ 
  ? 'http://192.168.50.207:8000'  
  : 'https://prod'; // Adjust when deploying

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = null; // empty for now
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log('Unauthorized - token may be invalid');
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
