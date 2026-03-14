import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Modal, Form, Input, Select, Typography, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SendOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { http } from '@rms/api';
import type { Requirement, Iteration } from '../types';
import { REQUIREMENT_PRIORITY, REQUIREMENT_TYPE } from '../const';

const { Title, Text } = Typography;

const Backlog: React.FC<{ projectId?: string | number }> = ({ projectId }) => {
  const [data, setData] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [form] = Form.useForm();
  const [planForm] = Form.useForm();

  const fetchData = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const requirements = await http.get<Requirement[]>('/requirements', { 
        params: { projectId, inBacklog: true } 
      });
      setData(requirements);
      
      const itRes = await http.get<Iteration[]>('/iterations', { 
        params: { projectId } 
      });
      setIterations(itRes.filter(it => it.status !== '已完成'));
    } catch (error) {
      console.error('Failed to fetch backlog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleCreate = async (values: any) => {
    try {
      await http.post('/requirements', { ...values, projectId, status: 'TODO' });
      message.success('需求创建成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handlePlanToIteration = async (values: { iterationId: number }) => {
    if (!selectedRequirement) return;
    try {
      await http.put(`/requirements/${selectedRequirement.id}`, {
        ...selectedRequirement,
        iterationId: values.iterationId
      });
      message.success(`已规划至迭代`);
      setIsPlanModalOpen(false);
      planForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('规划失败');
    }
  };

  const columns: ColumnsType<Requirement> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80, fixed: 'left', render: (id) => <span style={{ color: '#999' }}>#{id}</span> },
    { title: '需求标题', dataIndex: 'title', key: 'title', width: 350, render: (text) => <span style={{ fontWeight: 500, color: '#333' }}>{text}</span> },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (p: keyof typeof REQUIREMENT_PRIORITY) => {
        const config = REQUIREMENT_PRIORITY[p] || REQUIREMENT_PRIORITY.MEDIUM;
        return <Tag color={config.color} style={{ borderRadius: 10, padding: '0 10px' }}>{config.label}</Tag>;
      },
    },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type', 
      width: 100,
      render: (t: keyof typeof REQUIREMENT_TYPE) => REQUIREMENT_TYPE[t] || t
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'right',
      render: (_, record) => (
        <Space size={16}>
          <Tooltip title="规划到迭代"><SendOutlined style={{ color: '#5c67f2', cursor: 'pointer' }} onClick={() => { setSelectedRequirement(record); setIsPlanModalOpen(true); }} /></Tooltip>
          <Tooltip title="编辑"><EditOutlined style={{ color: '#666', cursor: 'pointer' }} /></Tooltip>
          <Tooltip title="删除"><DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Title level={5} style={{ margin: 0 }}>需求池 (Backlog)</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ height: 32, borderRadius: 4, fontSize: 13 }}>新建需求</Button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Table columns={columns} dataSource={data} rowKey="id" loading={loading} scroll={{ y: 'calc(100vh - 310px)', x: 1000 }} size="small" pagination={{ total: data.length, showTotal: (total) => `共 ${total} 条`, defaultPageSize: 25, showSizeChanger: true, position: ['bottomRight'], style: { padding: '16px 0', margin: 0, borderTop: '1px solid #f0f0f0' } }} />
      </div>
      <Modal title="新建需求" open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} destroyOnHidden>
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 16 }}>
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input placeholder="输入简要的需求标题" /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={4} placeholder="详细描述需求背景和验收标准" /></Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item name="priority" label="优先级" style={{ flex: 1 }} initialValue="MEDIUM">
              <Select options={Object.entries(REQUIREMENT_PRIORITY).map(([k, v]) => ({ label: v.label, value: k }))} />
            </Form.Item>
            <Form.Item name="type" label="类型" style={{ flex: 1 }} initialValue="FEATURE">
              <Select options={Object.entries(REQUIREMENT_TYPE).map(([k, v]) => ({ label: v, value: k }))} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal title="规划需求到迭代" open={isPlanModalOpen} onOk={() => planForm.submit()} onCancel={() => setIsPlanModalOpen(false)} okText="确认规划" destroyOnHidden>
        <div style={{ marginBottom: 20 }}><Text type="secondary">正在规划需求：</Text><div style={{ marginTop: 8, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}><Text strong>{selectedRequirement?.title}</Text></div></div>
        <Form form={planForm} layout="vertical" onFinish={handlePlanToIteration}>
          <Form.Item name="iterationId" label="选择目标迭代" rules={[{ required: true, message: '请选择一个迭代' }]}><Select placeholder="请选择进行中或未开始的迭代">{iterations.map(it => (<Select.Option key={it.id} value={it.id}>{it.name}</Select.Option>))}</Select></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Backlog;
