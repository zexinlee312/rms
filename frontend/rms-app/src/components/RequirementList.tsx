import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getRequirements } from '../api/requirement';
import type { Requirement } from '../api/requirement';

const RequirementList: React.FC = () => {
  const [data, setData] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取当前项目 ID
  const getProjectId = () => {
    // 1. 从 URL 参数取
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('projectId');
    if (idFromUrl) return idFromUrl;

    // 2. 从 micro-app 基座下发的数据取
    // @ts-ignore
    const dataFromBase = window.microApp?.getData();
    if (dataFromBase?.projectId) return dataFromBase.projectId;

    return undefined;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const projectId = getProjectId();
      const requirements = await getRequirements(projectId);
      setData(requirements);
    } catch (error) {
      console.error('Failed to fetch requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 监听基座下发的数据变化
    const handleDataChange = (data: any) => {
      if (data.projectId) {
        fetchData();
      }
    };

    // @ts-ignore
    window.microApp?.addDataListener(handleDataChange);
    // @ts-ignore
    return () => window.microApp?.removeDataListener(handleDataChange);
  }, []);

  const columns: ColumnsType<Requirement> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : 'blue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        let color = 'default';
        if (priority === 'HIGH') color = 'orange';
        if (priority === 'URGENT') color = 'red';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>编辑</a>
          <a>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>需求列表</h2>
        <Button type="primary" onClick={fetchData}>刷新</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
    </div>
  );
};

export default RequirementList;
