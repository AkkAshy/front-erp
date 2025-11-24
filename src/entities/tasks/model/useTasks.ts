import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../api/taskApi";
import type { CreateTaskRequest } from "../api/taskTypes";

// Query keys
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
  myTasks: () => [...taskKeys.all, "my"] as const,
  overdue: () => [...taskKeys.all, "overdue"] as const,
  today: () => [...taskKeys.all, "today"] as const,
};

// Get all tasks
export const useGetTasks = (params?: {
  status?: string;
  priority?: string;
  assigned_to?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: async () => {
      const response = await taskApi.getAllTasks(params);
      return response.data;
    },
  });
};

// Get my tasks
export const useGetMyTasks = () => {
  return useQuery({
    queryKey: taskKeys.myTasks(),
    queryFn: async () => {
      const response = await taskApi.getMyTasks();
      return response.data;
    },
  });
};

// Get overdue tasks
export const useGetOverdueTasks = () => {
  return useQuery({
    queryKey: taskKeys.overdue(),
    queryFn: async () => {
      const response = await taskApi.getOverdueTasks();
      return response.data;
    },
  });
};

// Get today's tasks
export const useGetTodayTasks = () => {
  return useQuery({
    queryKey: taskKeys.today(),
    queryFn: async () => {
      const response = await taskApi.getTodayTasks();
      return response.data;
    },
  });
};

// Get task detail
export const useGetTask = (id: number) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const response = await taskApi.getTask(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create task
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskApi.createTask(data),
    onSuccess: () => {
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.today() });
    },
  });
};

// Update task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateTaskRequest>;
    }) => taskApi.updateTask(id, data),
    onSuccess: (_, variables) => {
      // Invalidate all task lists and the specific task detail
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
};

// Update task status
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      completion_comment,
    }: {
      id: number;
      status: string;
      completion_comment?: string;
    }) =>
      taskApi.updateTaskStatus(id, {
        status: status as any,
        completion_comment,
      }),
    onSuccess: (_, variables) => {
      // Invalidate all task lists and the specific task detail
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.overdue() });
      queryClient.invalidateQueries({ queryKey: taskKeys.today() });
    },
  });
};

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onSuccess: () => {
      // Invalidate all task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
};

// Add comment
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, text }: { taskId: number; text: string }) =>
      taskApi.addComment(taskId, { text }),
    onSuccess: (_, variables) => {
      // Invalidate task detail to refresh comments
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId),
      });
    },
  });
};
