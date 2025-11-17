// ===== TASK TYPES (Vazifalar) =====

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskCategory = "inventory" | "sales" | "customer_service" | "maintenance" | "other";

// Task (Vazifa)
export type Task = {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  assigned_to?: number;
  assigned_to_name?: string;
  created_by: number;
  created_by_name: string;
  due_date?: string;  // ISO 8601
  completed_at?: string;
  created_at: string;
  updated_at: string;
};

// Create Task
export type CreateTask = {
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  assigned_to?: number;
  due_date?: string;  // ISO 8601
};

// Update Task
export type UpdateTask = Partial<CreateTask> & {
  status?: TaskStatus;
};

// Task Comment
export type TaskComment = {
  id: number;
  task: number;
  user: number;
  user_name: string;
  comment: string;
  created_at: string;
};

// Create Comment
export type CreateTaskComment = {
  task: number;
  comment: string;
};

// Task Template
export type TaskTemplate = {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  estimated_duration?: number;  //  <8=CB0E
  is_active: boolean;
  created_at: string;
};

// Task Stats
export type TaskStats = {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  overdue: number;
  today: number;
};

// Tasks List Response
export type TasksList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
};
