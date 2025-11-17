// API для работы с задачами
import { api } from "@/shared/api/base/client";
import type {
  Task,
  TaskDetail,
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  AddCommentRequest,
  TaskComment,
} from "./taskTypes";

const TASKS_URL = "/tasks/";

export const taskApi = {
  // Получить список всех задач
  getAllTasks: async (params?: {
    status?: string;
    priority?: string;
    assigned_to?: number;
    search?: string;
  }): Promise<{ count: number; next: string | null; previous: string | null; results: Task[] }> => {
    const response = await api.get<{ count: number; next: string | null; previous: string | null; results: Task[] }>(TASKS_URL, { params });
    return response.data;
  },

  // Получить мои задачи
  getMyTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>(`${TASKS_URL}/my_tasks/`);
    return response.data;
  },

  // Получить просроченные задачи
  getOverdueTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>(`${TASKS_URL}/overdue/`);
    return response.data;
  },

  // Получить задачи на сегодня
  getTodayTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>(`${TASKS_URL}/today/`);
    return response.data;
  },

  // Получить детали задачи
  getTask: async (id: number): Promise<TaskDetail> => {
    const response = await api.get<TaskDetail>(`${TASKS_URL}/${id}/`);
    return response.data;
  },

  // Создать задачу
  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(TASKS_URL, data);
    return response.data;
  },

  // Обновить задачу
  updateTask: async (id: number, data: Partial<CreateTaskRequest>): Promise<Task> => {
    const response = await api.patch<Task>(`${TASKS_URL}/${id}/`, data);
    return response.data;
  },

  // Обновить статус задачи
  updateTaskStatus: async (
    id: number,
    data: UpdateTaskStatusRequest
  ): Promise<TaskDetail> => {
    const response = await api.post<TaskDetail>(
      `${TASKS_URL}/${id}/update_status/`,
      data
    );
    return response.data;
  },

  // Удалить задачу
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`${TASKS_URL}/${id}/`);
  },

  // Добавить комментарий
  addComment: async (
    taskId: number,
    data: AddCommentRequest
  ): Promise<TaskComment> => {
    const response = await api.post<TaskComment>(
      `${TASKS_URL}/${taskId}/add_comment/`,
      data
    );
    return response.data;
  },

  // Получить комментарии задачи
  getComments: async (taskId: number): Promise<TaskComment[]> => {
    const response = await api.get<TaskComment[]>(
      `${TASKS_URL}/${taskId}/comments/`
    );
    return response.data;
  },
};
