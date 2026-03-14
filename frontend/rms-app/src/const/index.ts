export const ITERATION_STATUS = {
  UNOPENED: '未开启',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
} as const;

export const REQUIREMENT_PRIORITY = {
  URGENT: { color: '#f5222d', label: '紧急' },
  HIGH: { color: '#fa8c16', label: '高' },
  MEDIUM: { color: '#1890ff', label: '中' },
  LOW: { color: '#8c8c8c', label: '低' },
} as const;

export const REQUIREMENT_TYPE = {
  FEATURE: '新功能',
  BUG: '缺陷',
  IMPROVE: '优化',
} as const;
