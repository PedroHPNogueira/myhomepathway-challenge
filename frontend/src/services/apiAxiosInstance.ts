import axios from 'axios';

export const apiAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
