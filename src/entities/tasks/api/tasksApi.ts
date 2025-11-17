import { api } from "@/shared/api/base/client";
import type { CreateTask, UpdateTask, CreateTaskComment } from "./types";

export const tasksApi = {
  // ===== TASKS CRUD (Vazifalar CRUD) =====

  // >;CG8BL 2A5 7040G8
  // GET /api/tasks/tasks/
  getTasks: (params?: {
    status?: string;
    priority?: string;
    category?: string;
    assigned_to?: number;
    offset?: number;
    limit?: number;
  }) => api.get("/tasks/tasks/", { params }),

  // !>740BL 7040GC
  // POST /api/tasks/tasks/
  createTask: (data: CreateTask) => api.post("/tasks/tasks/", data),

  // >;CG8BL 7040GC ?> ID
  // GET /api/tasks/tasks/:task_id/
  getTask: (id: number) => api.get(`/tasks/tasks/${id}/`),

  // 1=>28BL 7040GC
  // PATCH /api/tasks/tasks/:task_id/
  updateTask: (id: number, data: UpdateTask) =>
    api.patch(`/tasks/tasks/${id}/`, data),

  // #40;8BL 7040GC
  // DELETE /api/tasks/tasks/:task_id/
  deleteTask: (id: number) => api.delete(`/tasks/tasks/${id}/`),

  // ===== TASK FILTERS (Vazifalarni filtrlash) =====

  // >8 7040G8
  // GET /api/tasks/tasks/my-tasks/
  getMyTasks: () => api.get("/tasks/tasks/my-tasks/"),

  // 040G8 =0 A53>4=O
  // GET /api/tasks/tasks/today/
  getTodayTasks: () => api.get("/tasks/tasks/today/"),

  // @>A@>G5==K5 7040G8
  // GET /api/tasks/tasks/overdue/
  getOverdueTasks: () => api.get("/tasks/tasks/overdue/"),

  // !B0B8AB8:0 7040G
  // GET /api/tasks/tasks/stats/
  getTaskStats: () => api.get("/tasks/tasks/stats/"),

  // ===== TASK ACTIONS (Vazifa harakatlari) =====

  // 0G0BL 7040GC
  // POST /api/tasks/tasks/:task_id/start/
  startTask: (id: number) => api.post(`/tasks/tasks/${id}/start/`),

  // 025@H8BL 7040GC
  // POST /api/tasks/tasks/:task_id/complete/
  completeTask: (id: number) => api.post(`/tasks/tasks/${id}/complete/`),

  // ===== TASK COMMENTS (Vazifa izohlari) =====

  // >1028BL :><<5=B0@89
  // POST /api/tasks/comments/
  addComment: (data: CreateTaskComment) => api.post("/tasks/comments/", data),

  // >;CG8BL :><<5=B0@88 7040G8
  // GET /api/tasks/comments/?task={task_id}
  getTaskComments: (taskId: number) =>
    api.get("/tasks/comments/", { params: { task: taskId } }),

  // ===== TASK TEMPLATES (Vazifa shablonlari) =====

  // >;CG8BL 2A5 H01;>=K
  // GET /api/tasks/templates/
  getTemplates: () => api.get("/tasks/templates/"),

  // !>740BL 7040GC 87 H01;>=0
  // POST /api/tasks/templates/:template_id/create-task/
  createTaskFromTemplate: (templateId: number, data?: {
    assigned_to?: number;
    due_date?: string;
  }) => api.post(`/tasks/templates/${templateId}/create-task/`, data),
};
