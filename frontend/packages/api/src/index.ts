import axios, { type AxiosRequestConfig } from 'axios';

// 统一的 Axios 实例配置
const instance = axios.create({
  // 使用绝对路径，确保在微前端环境下相对于基座域名发出请求
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true, // 核心：允许携带 HttpOnly Cookie
});

// 响应拦截器：统一处理 401 认证失效
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("认证失败，登录状态已过期");
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
