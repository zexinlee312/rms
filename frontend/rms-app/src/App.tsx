import React, { useState, useEffect } from 'react';
import { Tabs, Card } from 'antd';
import { DatabaseOutlined, SyncOutlined, TableOutlined } from '@ant-design/icons';
import Backlog from './components/Backlog';
import IterationList from './components/IterationList';

const App: React.FC = () => {
  const [projectId, setProjectId] = useState<string | number>();

  useEffect(() => {
    // 1. 初始获取基座下发的数据
    // @ts-ignore
    const initialData = window.microApp?.getData();
    if (initialData?.projectId) {
      setProjectId(initialData.projectId);
    }

    // 2. 监听基座数据变化
    const handleDataChange = (data: any) => {
      if (data.projectId) {
        setProjectId(data.projectId);
      }
    };

    // @ts-ignore
    window.microApp?.addDataListener(handleDataChange);
    // @ts-ignore
    return () => window.microApp?.removeDataListener(handleDataChange);
  }, []);

  const items = [
    {
      key: 'backlog',
      label: (
        <span>
          <DatabaseOutlined />
          需求池
        </span>
      ),
      children: <Backlog projectId={projectId} />,
    },
    {
      key: 'iterations',
      label: (
        <span>
          <SyncOutlined />
          迭代管理
        </span>
      ),
      children: <IterationList projectId={projectId} />,
    },
    {
      key: 'board',
      label: (
        <span>
          <TableOutlined />
          任务看板
        </span>
      ),
      children: <div style={{ padding: 40, textAlign: 'center' }}>看板功能开发中...</div>,
    },
  ];

  return (
    <div style={{ padding: '0' }}>
      <Card bordered={false} bodyStyle={{ padding: '16px' }}>
        <Tabs defaultActiveKey="backlog" items={items} />
      </Card>
    </div>
  );
};

export default App;
