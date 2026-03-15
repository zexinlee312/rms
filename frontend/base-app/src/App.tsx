import React, { useState, useEffect, useMemo } from 'react';
import {
  UserOutlined,
  LogoutOutlined,
  LayoutOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DesktopOutlined,
  HomeOutlined,
  CaretDownOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, theme, Avatar, Space, Dropdown, Button, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GingerLayout,
  GingerHeader,
  GingerSecHeader,
  GingerSidebar,
  DEFAULT_LAYOUT_CONFIG,
  COMMON_LAYOUT_CONFIG,
  useScreenQuery
} from '@rms/layout';
import type { GingerLayoutConfig } from '@rms/layout';
import Dashboard from './Dashboard';

const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

interface Project {
  id: number;
  name: string;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useScreenQuery();

  // 1. 状态管理
  const [userPreferredConfig, setUserPreferredConfig] = useState<GingerLayoutConfig>(() => {
    const saved = localStorage.getItem('ginger_layout_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.id === 'leftRight') return DEFAULT_LAYOUT_CONFIG;
      return parsed;
    }
    return DEFAULT_LAYOUT_CONFIG;
  });
  const [collapsed, setCollapsed] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // 从路径中精准提取项目 ID (支持 /rms/1, /code/1 等格式)
  const currentProjectId = useMemo(() => {
    const match = location.pathname.match(/\/(rms|work-items|code|delivery|artifacts|test|wiki|settings)\/(\d+)/);
    return match ? match[2] : localStorage.getItem('current_project_id');
  }, [location.pathname]);

  const currentProjectName = useMemo(() => {
    const project = projects.find(p => p.id.toString() === currentProjectId);
    return project ? project.name : '选择项目';
  }, [projects, currentProjectId]);

  // 2. 数据获取
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error('Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  // 3. 计算布局配置
  const currentConfig = useMemo(() => {
    let baseConfig = isMobile ? { ...COMMON_LAYOUT_CONFIG, id: 'horizontal-mobile' } : userPreferredConfig;
    const isHorizontal = baseConfig.id.startsWith('horizontal');
    const sidebarWidth = isHorizontal ? 60 : (collapsed ? 64 : 240);

    return {
      ...baseConfig,
      sidebar: {
        ...baseConfig.sidebar,
        firSidebar: {
          ...baseConfig.sidebar.firSidebar,
          width: sidebarWidth
        },
        hidden: isHomePage ? true : baseConfig.sidebar.hidden
      },
      footer: { hidden: true }
    };
  }, [isMobile, userPreferredConfig, collapsed, isHomePage]);

  useEffect(() => {
    localStorage.setItem('ginger_layout_config', JSON.stringify(userPreferredConfig));
  }, [userPreferredConfig]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      localStorage.removeItem('is_logged_in');
      localStorage.removeItem('current_project_id');
      navigate('/login');
    }
  };

  // 切换项目逻辑：保留当前模块，只替换 ID (例如 /rms/1 -> /rms/2)
  const handleProjectSwitch = (newId: number) => {
    localStorage.setItem('current_project_id', newId.toString());
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3) {
      pathParts[2] = newId.toString();
      navigate(pathParts.join('/'));
    } else {
      navigate(`/rms/${newId}`);
    }
  };

  // 4. 菜单项定义 (动态包含项目 ID)
  const sideMenuItems: MenuItem[] = useMemo(() => {
    if (isHomePage) return [];
    const pid = currentProjectId;
    return [
      getItem('需求管理', `/rms/${pid}/backlog`, <DesktopOutlined style={{ color: '#b37feb' }} />),
      getItem('设置', `/settings/${pid}`, <SettingOutlined style={{ color: '#ff7875' }} />),
    ];
  }, [isHomePage, currentProjectId]);


  const projectMenuItems: MenuProps['items'] = projects.map(p => ({
    key: p.id,
    label: p.name,
    icon: <ProjectOutlined />,
    onClick: () => handleProjectSwitch(p.id)
  }));

  const userMenuItems: MenuProps['items'] = [
    { key: 'home', label: '返回项目大盘', icon: <HomeOutlined />, onClick: () => navigate('/') },
    { type: 'divider' },
    { key: 'vertical', label: '纵向布局模式', icon: <AppstoreOutlined />, onClick: () => setUserPreferredConfig(DEFAULT_LAYOUT_CONFIG) },
    { key: 'horizontal', label: '横向布局模式', icon: <LayoutOutlined />, onClick: () => setUserPreferredConfig(COMMON_LAYOUT_CONFIG) },
    { type: 'divider' },
    { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  const renderContent = () => {
    if (isHomePage) return <Dashboard />;
    if (location.pathname.startsWith('/rms')) {
      // 动态确定子应用的 URL。
      // 在生产环境中，直接给一个以斜杠结尾的同源绝对路径，
      // 防止 micro-app 框架拼接不完整的 url 而导致浏览器 301 重定向。
      const microAppUrl = import.meta.env.MODE === 'production' 
        ? '/rms-app-service/' 
        : 'http://localhost:5174/';

      return (
        // @ts-ignore
        <micro-app
          name="rms-app"
          url={microAppUrl}
          baseroute="/rms" // 重要：子应用将基于 /rms 解析其内部路由
          iframe
          router-mode="native"
          data={{ projectId: currentProjectId }}
        ></micro-app>
      );
    }
    return <div style={{ padding: 40, textAlign: 'center' }}>这里是模块 {location.pathname} 的占位页面</div>;
  };

  const isHorizontal = currentConfig.id.startsWith('horizontal');

  return (
    <GingerLayout
      config={currentConfig}
      header={
        <GingerHeader>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 24px', justifyContent: 'space-between', borderBottom: isHorizontal ? 'none' : '1px solid #f0f0f0' }}>
            <h2 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px', fontWeight: 600 }}>
              {isMobile ? 'RMS' : '需求管理系统'}
            </h2>
            <Space size={12}>
              {!isMobile && <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Admin</span>}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                <Avatar size={28} icon={<UserOutlined />} style={{ backgroundColor: '#5c67f2', cursor: 'pointer' }} />
              </Dropdown>
            </Space>
          </div>
        </GingerHeader>
      }
      secHeader={
        <GingerSecHeader>
          <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
            <Menu mode="horizontal" selectedKeys={[location.pathname]} items={sideMenuItems} onClick={({ key }) => navigate(key)} style={{ lineHeight: '46px', borderBottom: 'none' }} />
          </div>
        </GingerSecHeader>
      }
      sidebar={
        <GingerSidebar>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', overflow: 'hidden' }}>
            {!isHorizontal && (
              <Dropdown menu={{ items: projectMenuItems }} trigger={['click']} placement="bottomLeft">
                <div
                  style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    padding: collapsed ? '0' : '0 20px',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    borderBottom: '1px solid #f5f5f5',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: '#fafafa'
                  }}
                >
                  {collapsed ? (
                    <ProjectOutlined style={{ fontSize: 20, color: '#5c67f2' }} />
                  ) : (
                    <>
                      <Text strong style={{ maxWidth: 160, fontSize: 16 }} ellipsis={{ tooltip: currentProjectName }}>
                        {currentProjectName}
                      </Text>
                      <CaretDownOutlined style={{ fontSize: 12, color: 'rgba(0,0,0,0.25)' }} />
                    </>
                  )}
                </div>
              </Dropdown>
            )}
            <Menu
              theme="light"
              selectedKeys={[location.pathname]}
              mode="inline"
              inlineCollapsed={collapsed}
              items={isHorizontal ? sideMenuItems.map(i => ({...i, label: ''})) : sideMenuItems}
              onClick={({ key }) => navigate(key)}
              style={{ flex: 1, paddingTop: 8, borderRight: 0 }}
            />
            {!isHorizontal && !isMobile && (
              <div style={{ height: 48, borderTop: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end', padding: collapsed ? 0 : '0 16px' }}>
                <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '16px', color: 'rgba(0,0,0,0.45)' }} />
              </div>
            )}
          </div>
        </GingerSidebar>
      }
    >
      <div style={{ height: '100%', background: isHomePage ? 'transparent' : colorBgContainer, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </div>
    </GingerLayout>
  );
};

export default App;
