import { createContext } from 'react';

export type LayoutMode = 'sidebarTop' | 'headerTop';

export interface LayoutHeaderConfig {
  height?: number;
  hidden?: boolean;
  zIndex?: number;
}

export interface LayoutSidebarConfig {
  width?: number;
  hidden?: boolean;
  zIndex?: number;
}

export interface GingerLayoutConfig {
  id: string;
  mode?: LayoutMode;
  header: {
    fixed?: boolean;
    hidden?: boolean;
    zIndex?: number;
    firHeader?: LayoutHeaderConfig;
    secHeader?: LayoutHeaderConfig;
  };
  sidebar: {
    fixed?: boolean;
    hidden?: boolean;
    zIndex?: number;
    firSidebar?: LayoutSidebarConfig;
    secSidebar?: LayoutSidebarConfig;
  };
  footer?: {
    height?: number;
    hidden?: boolean;
  };
  hideLogo?: boolean;
}

// 纵向模式：顶栏通栏 (原 headerTop)
export const DEFAULT_LAYOUT_CONFIG: GingerLayoutConfig = {
  id: 'vertical',
  mode: 'headerTop',
  header: {
    fixed: true,
    firHeader: { height: 60, hidden: false, zIndex: 101 },
    secHeader: { height: 40, hidden: true, zIndex: 100 },
    hidden: false,
    zIndex: 100,
  },
  sidebar: {
    fixed: true,
    firSidebar: { width: 240, hidden: false, zIndex: 101 },
    secSidebar: { width: 200, hidden: true, zIndex: 100 },
    hidden: false,
    zIndex: 100,
  },
  footer: {
    height: 60,
    hidden: false,
  },
  hideLogo: false,
};

// 横向模式：顶栏菜单 (原 common)
export const COMMON_LAYOUT_CONFIG: GingerLayoutConfig = {
  id: 'horizontal',
  mode: 'headerTop',
  header: {
    fixed: true,
    firHeader: { height: 60, hidden: false },
    secHeader: { height: 48, hidden: false },
    hidden: false,
  },
  sidebar: {
    fixed: true,
    firSidebar: { width: 60, hidden: true },
    secSidebar: { hidden: true },
    hidden: false,
  },
  footer: {
    hidden: false,
    height: 60
  },
};

export const GingerLayoutContext = createContext<GingerLayoutConfig>(DEFAULT_LAYOUT_CONFIG);
