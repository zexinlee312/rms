import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Modal, Form, Input, DatePicker, Space, Select, InputNumber, Progress, Tooltip, Typography, Avatar, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LockOutlined, UnlockOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { http } from '@rms/api';
import type { Iteration, User } from '../types';

const { Title, Text } = Typography;

const IterationList: React.FC<{ projectId?: string | number }> = ({ projectId }) => {
  const navigate = useNavigate();
  const [data, setData] = useState<Iteration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [itRes, memRes] = await Promise.all([
        http.get<Iteration[]>('/iterations', { params: { projectId } }),
        http.get<User[]>(`/projects/${projectId}/members`)
      ]);
      setData(itRes);
      setMembers(memRes);
    } catch (error) {
      console.error('Failed to fetch iteration data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [projectId]);

  const handleCreate = async (values: any) => {
    try {
      await http.post('/iterations', { ...values, projectId, status: '未开启', isLocked: false, totalWorkload: 0, totalTaskCount: 0, completedTaskCount: 0, startDate: values.range?.[0]?.format('YYYY-MM-DD'), endDate: values.range?.[1]?.format('YYYY-MM-DD') });
      message.success('迭代创建成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) { message.error('创建失败'); }
  };

  const handleNextStatus = async (record: Iteration) => {
    if (record.status === '已完成') return;
    try {
      await http.post(`/iterations/${record.id}/next-status`);
      fetchData();
    } catch (error) { message.error('更新状态失败'); }
  };

  const toggleLock = async (record: Iteration) => {
    try {
      await http.put(`/iterations/${record.id}`, { ...record, isLocked: !record.isLocked });
      fetchData();
    } catch (error) { message.error('操作失败'); }
  };

  const getNextStatusName = (status: string) => {
    if (status === '未开启') return '开始迭代';
    if (status === '进行中') return '完成迭代';
    return null;
  };

  const columns: ColumnsType<Iteration> = [
    { title: '迭代标题', dataIndex: 'name', key: 'name', width: 250, fixed: 'left', render: (text, record) => (<a style={{ color: '#5c67f2', fontWeight: 500 }} onClick={() => navigate(`/${projectId}/sprint/${record.id}`)}>{text}</a>) },
    {
      title: '状态', key: 'status', width: 120,
      render: (_, record) => {
        const nextStatus = getNextStatusName(record.status);
        const isFinished = record.status === '已完成';
        const config = { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f' };
        const tagContent = (<Tag className={`status-tag ${!isFinished ? 'clickable' : ''}`} style={{ background: config.bg, color: config.color, borderColor: config.border, borderRadius: 4, padding: '0 8px', cursor: isFinished ? 'default' : 'pointer', transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 4 }}><span className="current-text">{record.status || '未开启'}</span>{!isFinished && <span className="next-text"><ArrowRightOutlined /> {nextStatus}</span>}</Tag>);
        if (isFinished) return tagContent;
        return (<Popconfirm title={`确定要${nextStatus}吗？`} disabled={record.status === '未开启'} onConfirm={() => handleNextStatus(record)}><div onClick={() => record.status === '未开启' && handleNextStatus(record)}>{tagContent}</div></Popconfirm>);
      }
    },
    { title: '起止时间', key: 'period', width: 240, render: (_, record) => (<span style={{ color: '#333' }}>{record.startDate || 'YYYY-MM-DD'} ~ {record.endDate || 'YYYY-MM-DD'}</span>) },
    { title: '负责人', dataIndex: 'ownerId', key: 'ownerId', width: 150, render: (ownerId) => { const user = members.find(m => m.id === ownerId); const name = user?.nickname || user?.username || '-'; return (<Space size={8}><Avatar size={24} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /><Text ellipsis style={{ maxWidth: 80 }}>{name}</Text></Space>); } },
    { title: '完成度', key: 'progress', width: 180, render: (_, record) => (<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Progress percent={Math.round((record.completedTaskCount / (record.totalTaskCount || 1)) * 100)} size={[80, 4]} showInfo={false} strokeColor="#1890ff" trailColor="#e8e8e8" style={{ width: 80 }} /><span style={{ color: '#bfbfbf', fontSize: 13 }}>{record.completedTaskCount}/{record.totalTaskCount}</span></div>) },
    { title: '工时容量', key: 'capacity', width: 220, render: (_, record) => (<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Progress percent={Math.min(100, Math.round((record.totalWorkload / (record.capacity || 1)) * 100))} size={[100, 4]} showInfo={false} strokeColor={record.totalWorkload > record.capacity ? '#ff4d4f' : '#bfbfbf'} trailColor="#e8e8e8" style={{ width: 100 }} /><span style={{ color: '#bfbfbf', fontSize: 13 }}>{(record.totalWorkload || 0).toFixed(1)}/{(record.capacity || 0).toFixed(1)}</span></div>) },
    { title: '操作', key: 'action', width: 120, align: 'right', render: (_, record) => (<Space size={16}><Tooltip title="编辑"><EditOutlined style={{ color: '#333', cursor: 'pointer', fontSize: 16 }} /></Tooltip><Tooltip title={record.isLocked ? '解锁' : '锁定'}><div onClick={() => toggleLock(record)} style={{ cursor: 'pointer' }}>{record.isLocked ? <LockOutlined style={{ color: '#333', fontSize: 16 }} /> : <UnlockOutlined style={{ color: '#333', fontSize: 16 }} />}</div></Tooltip><Tooltip title="删除"><DeleteOutlined style={{ color: '#333', cursor: 'pointer', fontSize: 16 }} /></Tooltip></Space>) }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', height: '100%', overflow: 'hidden', padding: '16px 0' }}>
      <div style={{ paddingBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}><Title level={5} style={{ margin: 0 }}>迭代管理</Title><Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ height: 32, borderRadius: 4, fontSize: 13 }}>开启新迭代</Button></div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}><Table columns={columns} dataSource={data} rowKey="id" loading={loading} scroll={{ y: 'calc(100vh - 300px)', x: 1280 }} pagination={{ total: data.length, showTotal: (total) => `共 ${total} 条`, defaultPageSize: 25, showSizeChanger: true, pageSizeOptions: ['10', '25', '50', '100'], position: ['bottomRight'], style: { padding: '12px 0', margin: 0, borderTop: '1px solid #f0f0f0' } }} className="full-height-table" /></div>
      <style>{`.full-height-table { flex: 1; display: flex; flex-direction: column; min-height: 0; } .full-height-table .ant-spin-nested-loading, .full-height-table .ant-spin-container, .full-height-table .ant-table, .full-height-table .ant-table-container { flex: 1; display: flex; flex-direction: column; min-height: 0; } .full-height-table .ant-table-body { flex: 1 !important; } .full-height-table .ant-table-thead > tr > th { background-color: #fcfcfc !important; color: #888 !important; font-weight: normal !important; padding: 12px 16px !important; } .status-tag.clickable:hover { background: #52c41a !important; color: #fff !important; border-color: #52c41a !important; } .status-tag.clickable:hover .current-text { display: none; } .status-tag.clickable:hover .next-text { display: inline-block; } .status-tag .next-text { display: none; font-size: 12px; }`}</style>
      <Modal title="开启新迭代" open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)} width={500} okText="开启迭代" cancelText="取消" destroyOnHidden>
        <Form form={form} layout="vertical" onFinish={handleCreate} style={{ marginTop: 16 }}>
          <Form.Item name="name" label="迭代名称" rules={[{ required: true, message: '请输入迭代名称' }]}><Input placeholder="例如：Sprint 1 - 基础框架搭建" /></Form.Item>
          <div style={{ display: 'flex', gap: 16 }}><Form.Item name="ownerId" label="负责人" style={{ flex: 1 }} rules={[{ required: true, message: '请选择负责人' }]}><Select placeholder="选择迭代负责人" showSearch optionFilterProp="children">{members.map(m => (<Select.Option key={m.id} value={m.id}>{m.nickname || m.username}</Select.Option>))}</Select></Form.Item><Form.Item name="capacity" label="工时容量 (h)" style={{ flex: 1 }} initialValue={80}><InputNumber style={{ width: '100%' }} min={0} placeholder="例如：80" /></Form.Item></div>
          <Form.Item name="range" label="迭代周期" rules={[{ required: true, message: '请选择迭代周期' }]}><DatePicker.RangePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="description" label="迭代目标/描述"><Input.TextArea rows={3} placeholder="简述本次迭代的核心目标和交付物" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IterationList;
