import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Modal, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getRequirements, createRequirement } from '../api/requirement';
import type { Requirement } from '../api/requirement';

const Backlog: React.FC<{ projectId?: string | number }> = ({ projectId }) => {
  const [data, setData] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const requirements = await getRequirements({ projectId, inBacklog: true });
      setData(requirements);
    } catch (error) {
      console.error('Failed to fetch backlog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchData();
  }, [projectId]);

  const handleCreate = async (values: any) => {
    try {
      await createRequirement({ ...values, projectId });
      message.success('需求创建成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const columns: ColumnsType<Requirement> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (p) => <Tag color={p === 'HIGH' ? 'red' : 'orange'}>{p}</Tag>,
    },
    { title: '类型', dataIndex: 'type', key: 'type' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>编辑</a>
          <a>移动到迭代</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h3>需求池 (Backlog)</h3>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>+ 新建需求</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} size="small" />

      <Modal title="新建需求" open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="priority" label="优先级" initialValue="MEDIUM">
            <Select options={[
              { label: '紧急', value: 'URGENT' },
              { label: '高', value: 'HIGH' },
              { label: '中', value: 'MEDIUM' },
              { label: '低', value: 'LOW' },
            ]} />
          </Form.Item>
          <Form.Item name="type" label="类型" initialValue="FEATURE">
            <Select options={[
              { label: '新功能', value: 'FEATURE' },
              { label: '缺陷', value: 'BUG' },
              { label: '优化', value: 'IMPROVE' },
            ]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Backlog;
