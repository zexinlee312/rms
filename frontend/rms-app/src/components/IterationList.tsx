import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Modal, Form, Input, DatePicker, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface Iteration {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
}

const IterationList: React.FC<{ projectId?: string | number }> = ({ projectId }) => {
  const [data, setData] = useState<Iteration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 微前端环境下使用基座代理
  const API_BASE = window.__MICRO_APP_ENVIRONMENT__ ? 'http://localhost:5173/api' : '/api';

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/iterations`, { params: { projectId }, withCredentials: true });
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch iterations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId]);

  const handleCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        projectId,
        startDate: values.range?.[0]?.format('YYYY-MM-DD'),
        endDate: values.range?.[1]?.format('YYYY-MM-DD'),
      };
      await axios.post(`${API_BASE}/iterations`, payload, { withCredentials: true });
      message.success('迭代创建成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const columns: ColumnsType<Iteration> = [
    { title: '迭代名称', dataIndex: 'name', key: 'name' },
    { title: '开始日期', dataIndex: 'startDate', key: 'startDate' },
    { title: '结束日期', dataIndex: 'endDate', key: 'endDate' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'OPEN' ? 'green' : 'default'}>{status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <a>进入看板</a>
          <a>设置</a>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h3>迭代管理</h3>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>+ 开启新迭代</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal title="开启新迭代" open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="迭代名称" rules={[{ required: true }]}>
            <Input placeholder="例如：Iteration 1" />
          </Form.Item>
          <Form.Item name="range" label="迭代周期" rules={[{ required: true }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="迭代描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IterationList;
