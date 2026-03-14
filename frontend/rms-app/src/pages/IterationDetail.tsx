import React, { useEffect, useState } from 'react';
import { Layout, Button, Typography, Space, Tag, Progress, Tabs, Checkbox, Dropdown, Empty } from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusCircleFilled, 
  SearchOutlined, 
  FilterOutlined, 
  UnorderedListOutlined, 
  LinkOutlined, 
  EllipsisOutlined, 
  CheckOutlined,
  FileTextOutlined,
  DownOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { http } from '@rms/api';
import type { Iteration } from '../types';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const IterationDetail: React.FC<{ projectId: string | number }> = ({ projectId }) => {
  const { iterationId } = useParams();
  const navigate = useNavigate();
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [currentIteration, setCurrentIteration] = useState<Iteration | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await http.get<Iteration[]>('/iterations', { params: { projectId } });
      setIterations(res);
      const current = res.find(it => it.id.toString() === iterationId);
      setCurrentIteration(current || null);
    } catch (error) {
      console.error('Failed to fetch iterations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, iterationId]);

  const headerTabs = [
    { key: 'overview', label: '概览' },
    { key: 'workitems', label: '工作项' },
    { key: 'docs', label: <FileTextOutlined style={{ fontSize: 16 }} /> },
  ];

  return (
    <Layout style={{ height: '100%', background: '#fff' }}>
      <Sider width={260} theme="light" style={{ borderRight: '1px solid #f0f0f0', padding: '0 16px' }}>
        <div style={{ padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/${projectId}/sprint`)} />
            <Text strong style={{ fontSize: 18 }}>迭代</Text>
          </div>
          <Button type="link" icon={<PlusCircleFilled />} style={{ color: '#5c67f2', padding: 0, marginBottom: 20 }}>新建迭代</Button>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', cursor: 'pointer' }}>
            <Text>未规划工作项</Text>
            <Text type="secondary" style={{ background: '#f0f0f0', padding: '0 6px', borderRadius: 10, fontSize: 12 }}>0</Text>
          </div>
          <div style={{ marginTop: 12 }}>
            {iterations.map(it => (
              <div key={it.id} onClick={() => navigate(`/${projectId}/sprint/${it.id}`)} style={{ padding: '12px', borderRadius: 8, background: it.id.toString() === iterationId ? '#eef2ff' : 'transparent', cursor: 'pointer', marginBottom: 8, border: it.id.toString() === iterationId ? '1px solid #adc6ff' : '1px solid transparent' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text strong>{it.name}</Text>
                  <Tag color="success" style={{ margin: 0, borderRadius: 4, fontSize: 11 }}>{it.status}</Tag>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 8 }}>规划工时 {it.totalWorkload}h</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>{it.startDate} ~ {it.endDate}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Progress percent={Math.round((it.completedTaskCount / (it.totalTaskCount || 1)) * 100)} size={[undefined, 4]} showInfo={false} style={{ flex: 1 }} />
                  <Text type="secondary" style={{ fontSize: 11 }}>{it.completedTaskCount}/{it.totalTaskCount}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sider>
      <Content style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={24}>
            <Title level={4} style={{ margin: 0 }}>{currentIteration?.name}</Title>
            <Tabs defaultActiveKey="workitems" items={headerTabs} className="detail-header-tabs" style={{ marginBottom: -17 }} />
          </Space>
          <Space>
            <Button>规划迭代</Button>
            <Button icon={<CheckOutlined />}>完成迭代</Button>
            <Button icon={<EllipsisOutlined />} />
          </Space>
        </div>
        <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={16}>
            <Dropdown menu={{ items: [] }}><Button type="text" style={{ padding: 0 }}><Text strong style={{ fontSize: 16 }}>全部工作项 · 0</Text> <DownOutlined style={{ fontSize: 12 }} /></Button></Dropdown>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 24 }}><Checkbox>需求</Checkbox><Checkbox>任务</Checkbox><Checkbox>缺陷</Checkbox></div>
            <Space size={12} style={{ marginLeft: 16, color: 'rgba(0,0,0,0.45)' }}><SearchOutlined style={{ fontSize: 18, cursor: 'pointer' }} /><FilterOutlined style={{ fontSize: 18, cursor: 'pointer' }} /><UnorderedListOutlined style={{ fontSize: 18, cursor: 'pointer' }} /><LinkOutlined style={{ fontSize: 18, cursor: 'pointer' }} /></Space>
          </Space>
          <Space><Dropdown menu={{ items: [] }}><Button>批量操作 <DownOutlined /></Button></Dropdown><Dropdown.Button icon={<DownOutlined />} menu={{ items: [] }}><UnorderedListOutlined /> 列表</Dropdown.Button><Dropdown.Button type="primary" menu={{ items: [] }} style={{ borderRadius: 4 }}>新建</Dropdown.Button></Space>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={<div style={{ textAlign: 'center' }}><Title level={4}>暂无工作项</Title><Text type="secondary">聚合需求、缺陷和任务，在一处管理所有事项</Text><div style={{ marginTop: 24 }}><Dropdown.Button type="primary" menu={{ items: [] }}>新建</Dropdown.Button></div></div>} />
        </div>
      </Content>
      <style>{`.detail-header-tabs .ant-tabs-nav::before { border-bottom: none !important; } .detail-header-tabs .ant-tabs-tab { padding: 8px 16px !important; } .detail-header-tabs .ant-tabs-ink-bar { height: 3px !important; background: #5c67f2 !important; }`}</style>
    </Layout>
  );
};

export default IterationDetail;
