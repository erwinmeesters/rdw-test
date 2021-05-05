import axios from 'axios';
import { loader } from '@/modules/core/store/loader';

declare module 'axios' {
  export interface AxiosRequestConfig {
    loader?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_RDW_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

apiClient.defaults.baseURL = process.env.VUE_APP_RDW_API;

apiClient.interceptors.request.use(
  (request: any) => {
    loader.start();
    return request;
  },
  (error: any) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: any) => {
    loader.stop();

    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  },
  (error: any) => {
    loader.stop();
    if (error.response && error.response.status) {
      return Promise.reject(error.response);
    }
  }
);

export default apiClient;
