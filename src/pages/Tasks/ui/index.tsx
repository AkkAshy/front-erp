import React, { useState } from "react";
import { useGetTasks, useCreateTask } from "@/entities/tasks/model/useTasks";
import { api } from "@/shared/api/base/client";
import { useQuery } from "@tanstack/react-query";
import DashedButton from "@/shared/ui/DashedButton";
import TaskCard from "@/widgets/TaskCard";
import AddTaskModal from "@/features/AddTaskModal/ui";
import type { CreateTaskRequest } from "@/entities/tasks/api/taskTypes";
import styles from "./Tasks.module.scss";

const Tasks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  // Fetch tasks
  const { data: tasks, isLoading: tasksLoading } = useGetTasks({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  // Fetch users (employees)
  const { data: usersResponse } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users/users/"),
  });

  // Fetch profile to get current store info
  const { data: profileResponse } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.get("/users/profile/"),
  });

  // Create task mutation
  const createTask = useCreateTask();

  const handleCreateTask = (data: CreateTaskRequest) => {
    createTask.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  // Prepare users list from API response
  // Реальная структура: просто массив [{ id, username, full_name, ... }]
  const users = Array.isArray(usersResponse?.data)
    ? usersResponse.data.map((user: any) => ({
        id: user.id,
        full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      }))
    : [];

  // Prepare stores list from profile
  // Пока используем текущий магазин из профиля
  const currentStore = profileResponse?.data?.data?.store;
  const stores = currentStore
    ? [
        {
          id: currentStore.id,
          name: currentStore.name,
        },
      ]
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Vazifalar</h1>
          <p className={styles.subtitle}>Barcha vazifalarni boshqaring</p>
        </div>
        <DashedButton onClick={() => setIsModalOpen(true)}>
          + Yangi vazifa
        </DashedButton>
      </div>

      <div className={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">Barcha statuslar</option>
          <option value="pending">Kutilmoqda</option>
          <option value="in_progress">Jarayonda</option>
          <option value="completed">Bajarilgan</option>
          <option value="cancelled">Bekor qilingan</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className={styles.select}
        >
          <option value="">Barcha muhimliklar</option>
          <option value="low">Past</option>
          <option value="medium">O'rta</option>
          <option value="high">Yuqori</option>
          <option value="urgent">Juda muhim</option>
        </select>
      </div>

      <div className={styles.content}>
        {tasksLoading ? (
          <div className={styles.loading}>Yuklanmoqda...</div>
        ) : tasks?.results && tasks.results.length > 0 ? (
          <div className={styles.taskGrid}>
            {tasks.results.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="120" height="120" rx="20" fill="#F1F5F9" />
              <path
                d="M60 40V80M40 60H80"
                stroke="#94A3B8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <h3>Vazifalar yo'q</h3>
            <p>Yangi vazifa yaratish uchun yuqoridagi tugmani bosing</p>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        users={users}
        stores={stores}
        isLoading={createTask.isPending}
      />
    </div>
  );
};

export default Tasks;
