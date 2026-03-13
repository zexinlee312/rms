import React, { useContext } from 'react';
import { GingerLayoutContext } from './interface';

export const GingerHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const config = useContext(GingerLayoutContext);
  const headerConfig = config.header.firHeader;
  if (headerConfig?.hidden) return null;
  return (
    <div 
      className="ginger-layout-header" 
      style={{ height: headerConfig?.height, zIndex: headerConfig?.zIndex }}
    >
      {children}
    </div>
  );
};

export const GingerSecHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const config = useContext(GingerLayoutContext);
  const secHeaderConfig = config.header.secHeader;
  if (secHeaderConfig?.hidden) return null;
  return (
    <div 
      className="ginger-layout-sec-header" 
      style={{ height: secHeaderConfig?.height, zIndex: secHeaderConfig?.zIndex }}
    >
      {children}
    </div>
  );
};

export const GingerSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const config = useContext(GingerLayoutContext);
  const sidebarConfig = config.sidebar.firSidebar;
  if (sidebarConfig?.hidden) return null;
  return (
    <div 
      className="ginger-layout-sidebar" 
      style={{ width: sidebarConfig?.width, zIndex: sidebarConfig?.zIndex, height: '100%' }}
    >
      {children}
    </div>
  );
};

export const GingerSecSidebar: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const config = useContext(GingerLayoutContext);
  const secSidebarConfig = config.sidebar.secSidebar;
  if (secSidebarConfig?.hidden) return null;
  return (
    <div 
      className="ginger-layout-sec-sidebar" 
      style={{ width: secSidebarConfig?.width, zIndex: secSidebarConfig?.zIndex, height: '100%' }}
    >
      {children}
    </div>
  );
};

export const GingerFooter: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const config = useContext(GingerLayoutContext);
  const footerConfig = config.footer;
  if (footerConfig?.hidden) return null;
  return (
    <div 
      className="ginger-layout-footer" 
      style={{ height: footerConfig?.height }}
    >
      {children}
    </div>
  );
};
