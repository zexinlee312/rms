import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, message, Empty, Button, Modal, Form, Input } from 'antd';
import { ProjectOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else if (response.status === 401) {
        navigate('/login');
      }
    } catch (error) {
      message.error('加载项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: number) => {
    localStorage.setItem('current_project_id', projectId.toString());
    navigate(`/rms?projectId=${projectId}`);
  };

  const handleCreateProject = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        message.success('项目创建成功');
        setIsModalOpen(false);
        form.resetFields();
        fetchProjects(); // 刷新列表
      } else {
        message.error('项目创建失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" tip="加载项目中..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>我的项目</Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>欢迎回来！请选择一个项目开始工作。</Paragraph>
        </div>
        <Button 
          type="primary" 
          size="large" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalOpen(true)}
          style={{ borderRadius: 8, height: 48, paddingLeft: 24, paddingRight: 24 }}
        >
          新建项目
        </Button>
      </div>

      {projects.length > 0 ? (
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={projects}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                style={{ height: '100%', borderRadius: 12, overflow: 'hidden' }}
                onClick={() => handleProjectClick(item.id)}
                cover={
                  <div style={{ 
                    height: 120, 
                    background: 'linear-gradient(135deg, #5c67f2 0%, #a2abff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ProjectOutlined style={{ fontSize: 48, color: '#fff' }} />
                  </div>
                }
              >
                <Card.Meta
                  title={<span style={{ fontSize: 18 }}>{item.name}</span>}
                  description={
                    <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ marginBottom: 0 }}>
                      {item.description || '暂无项目描述'}
                    </Paragraph>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="你还没有参与任何项目" />
      )}

      <Modal
        title="新建项目"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={submitting}
        okText="创建"
        cancelText="取消"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateProject}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" size="large" />
          </Form.Item>
          <Form.Item
            name="description"
            label="项目描述"
          >
            <Input.TextArea placeholder="请输入项目描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
