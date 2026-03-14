import React, { useState, useEffect, useMemo } from 'react';
import { Tabs } from 'antd';
import { DatabaseOutlined, SyncOutlined, TableOutlined } from '@ant-design/icons';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Backlog from './pages/Backlog';
import IterationList from './pages/IterationList';
import IterationDetail from './pages/IterationDetail';
import './index.css';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { projectId, tab } = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return {
      projectId: parts[0] || '',
      tab: parts[1] || 'backlog'
    };
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    navigate(`/${projectId}/${key}`);
  };

  const tabItems = [
    {
      key: 'backlog',
      label: (
        <span>
          <DatabaseOutlined />
          需求池
        </span>
      ),
    },
    {
      key: 'sprint',
      label: (
        <span>
          <SyncOutlined />
          迭代管理
        </span>
      ),
    },
    {
      key: 'board',
      label: (
        <span>
          <TableOutlined />
          任务看板
        </span>
      ),
    },
  ];

  // 判断是否在详情页（路径长度 > 2，例如 /1/sprint/5）
  const isDetailView = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.length > 2 && parts[1] === 'sprint';
  }, [location.pathname]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: isDetailView ? 0 : '0 24px' }}>
      {!isDetailView && (
        <Tabs 
          activeKey={tab} 
          items={tabItems} 
          onChange={handleTabChange}
          style={{ flexShrink: 0 }}
        />
      )}
      
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: isDetailView ? 0 : '16px 0' }}>
        <Routes>
          <Route path="/:projectId/backlog" element={<Backlog projectId={projectId} />} />
          <Route path="/:projectId/sprint" element={<IterationList projectId={projectId} />} />
          <Route path="/:projectId/sprint/:iterationId" element={<IterationDetail projectId={projectId} />} />
          <Route path="/:projectId/board" element={<div style={{ padding: 40, textAlign: 'center' }}>看板功能开发中...</div>} />
          <Route path="/:projectId" element={<Backlog projectId={projectId} />} />
        </Routes>
      </div>

      <style>{`
        .ant-tabs-nav {
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default App;
