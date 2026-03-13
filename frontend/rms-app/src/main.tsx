import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'

// 兼容在基座中运行和独立运行的 baseroute
const baseroute = window.__MICRO_APP_BASE_ROUTE__ || '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={baseroute}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

