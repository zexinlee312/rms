import '@ant-design/v5-patch-for-react-19';
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './Login'
import microApp from '@micro-zoe/micro-app'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

// 初始化微前端
microApp.start({
  // 可选：禁用沙箱或进行定制化配置
  // disableSandbox: true, 
})

// 路由守卫组件
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLoggedIn = localStorage.getItem('is_logged_in');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, location, navigate]);

  return isLoggedIn ? <>{children}</> : null;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="*" 
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        } 
      />
    </Routes>
  </BrowserRouter>,
)
