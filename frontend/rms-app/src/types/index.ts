export interface User {
  id: number;
  username: string;
  nickname: string;
}

export interface Iteration {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  ownerId: number;
  capacity: number;
  totalWorkload: number;
  totalTaskCount: number;
  completedTaskCount: number;
  isLocked: boolean;
}

export interface Requirement {
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  projectId: number | string;
  iterationId?: number | string;
  createdAt?: string;
}
