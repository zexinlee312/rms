import axios from 'axios';

// 使用相对路径，由 Vite 代理转发到后端
// 在微前端环境下，默认请求会相对于基座域名发出，这正是我们想要的
const API_BASE_URL = '/api';

// 创建 axios 实例
const request = axios.create({
  // 如果在微前端环境，手动指定基座地址作为前缀，避免 403 跨域
  baseURL: window.__MICRO_APP_ENVIRONMENT__ ? 'http://localhost:5173/api' : '/api',
  timeout: 5000,
  withCredentials: true, 
});

// 如果后端返回 401 (未授权/Cookie失效)，可以直接在这里捕获并抛出事件给基座，或者重定向
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 可以在此处通过微前端通信通知基座退回登录页
      console.error("认证失败，Cookie 可能已过期");
      // window.microApp?.dispatch({ type: 'logout' }); 
    }
    return Promise.reject(error);
  }
);

export interface Requirement {
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  createdAt?: string;
}

export const getRequirements = async (params: {
  projectId?: number | string;
  iterationId?: number | string;
  inBacklog?: boolean;
}): Promise<Requirement[]> => {
  const response = await request.get('/requirements', {
    params
  });
  return response.data;
};

export const createRequirement = async (requirement: Requirement): Promise<boolean> => {
  const response = await request.post('/requirements', requirement);
  return response.data;
};
