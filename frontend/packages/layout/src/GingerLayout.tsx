import React, { useMemo } from 'react';
import { Layout } from 'antd';
import classNames from 'classnames';
import { DEFAULT_LAYOUT_CONFIG, GingerLayoutContext } from './interface';
import type { GingerLayoutConfig } from './interface';
import './GingerLayout.scss';

const { Header, Content, Footer, Sider } = Layout;

export interface GingerLayoutProps {
  config?: GingerLayoutConfig;
  sidebar?: React.ReactNode;
  secSidebar?: React.ReactNode;
  header?: React.ReactNode;
  secHeader?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export const GingerLayout: React.FC<GingerLayoutProps> = ({
  config: propsConfig,
  sidebar,
  secSidebar,
  header,
  secHeader,
  footer,
  children
}) => {
  const config = useMemo(() => ({
    ...DEFAULT_LAYOUT_CONFIG,
    ...propsConfig,
    header: { ...DEFAULT_LAYOUT_CONFIG.header, ...propsConfig?.header },
    sidebar: { ...DEFAULT_LAYOUT_CONFIG.sidebar, ...propsConfig?.sidebar }
  }), [propsConfig]);

  const getSidebarWidth = () => {
    let width = 0;
    if (config.sidebar.hidden) return 0;
    if (!config.sidebar.firSidebar?.hidden) width += (config.sidebar.firSidebar?.width || 0);
    if (!config.sidebar.secSidebar?.hidden) width += (config.sidebar.secSidebar?.width || 0);
    return width;
  };

  const getHeaderHeight = () => {
    let height = 0;
    if (config.header.hidden) return 0;
    if (!config.header.firHeader?.hidden) height += (config.header.firHeader?.height || 0);
    if (!config.header.secHeader?.hidden) height += (config.header.secHeader?.height || 0);
    return height;
  };

  const sidebarWidth = getSidebarWidth();
  const headerHeight = getHeaderHeight();

  return (
    <GingerLayoutContext.Provider value={config}>
      <Layout className="ginger-layout">
        {/* 占位 Aside */}
        {config.sidebar.fixed && !config.sidebar.hidden && (
          <Sider
            width={sidebarWidth}
            className="da-layout-aside-placeholder"
            style={{ flex: `0 0 ${sidebarWidth}px`, background: 'transparent' }}
          />
        )}

        {/* 实际 Sidebar */}
        <Sider
          width={sidebarWidth}
          className={classNames('da-layout-aside-wrapper', {
            'da-no-sec-sidebar': config.sidebar.secSidebar?.hidden,
            'da-layout-aside-fixed': config.sidebar.fixed,
            'da-sidebar-top': config.mode === 'sidebarTop',
          })}
          style={{
            display: config.sidebar.hidden ? 'none' : 'flex',
            zIndex: config.sidebar.zIndex,
            paddingTop: config.mode === 'headerTop' ? headerHeight : 0,
          }}
        >
          {sidebar}
          {secSidebar}
        </Sider>

        <Layout>
          {/* 占位 Header */}
          {config.header.fixed && !config.header.hidden && (
            <Header style={{ height: headerHeight, background: 'transparent' }} />
          )}

          {/* 实际 Header */}
          <Header
            className={classNames('da-layout-header-wrapper', {
              'da-no-sec-header': config.header.secHeader?.hidden,
              'da-layout-header-fixed': config.header.fixed,
            })}
            style={{
              height: headerHeight,
              width: (config.header.fixed && config.mode === 'sidebarTop') ? `calc(100% - ${sidebarWidth}px)` : '100%',
              display: config.header.hidden ? 'none' : 'flex',
              zIndex: config.header.zIndex,
              left: (config.header.fixed && config.mode === 'sidebarTop') ? sidebarWidth : 0,
            }}
          >
            {header}
            {secHeader}
          </Header>

          <Content className="da-layout-content-wrapper">
            {children}
          </Content>

          {!config.footer?.hidden && (
            <Footer className="da-layout-footer-wrapper">
              {footer}
            </Footer>
          )}
        </Layout>
      </Layout>
    </GingerLayoutContext.Provider>
  );
};
