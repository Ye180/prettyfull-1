// import { getItem } from '@/lib/utils/local-storage';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// apiClient.interceptors.request.use((config) => {
//   const token = getItem('accessToken');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default apiClient;
