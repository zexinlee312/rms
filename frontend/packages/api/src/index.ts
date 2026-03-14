import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
});

// 通用响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      console.error('认证失败，请重新登录');
    }
    return Promise.reject(error);
  }
);

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) => instance.get<any, T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => instance.post<any, T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => instance.put<any, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => instance.delete<any, T>(url, config),
};

export default http;
