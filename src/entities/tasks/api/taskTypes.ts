// Типы для задач сотрудников

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TaskComment {
  id: number;
  task: number;
  author: number;
  author_name: string;
  author_username: string;
  text: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  store: number;
  store_name: string;
  assigned_to: number;
  assigned_to_name: string;
  assigned_to_username: string;
  created_by: number | null;
  created_by_name?: string;
  created_by_username?: string;
  priority: TaskPriority;
  priority_display: string;
  status: TaskStatus;
  status_display: string;
  deadline: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  completion_comment?: string;
  is_overdue: boolean;
  comments_count: number;
}

export interface TaskDetail extends Task {
  comments: TaskComment[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assigned_to: number;
  priority: TaskPriority;
  deadline: string;
  store: number;
}

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
  completion_comment?: string;
}

export interface AddCommentRequest {
  text: string;
}

export interface TasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}
