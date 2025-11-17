import React from "react";
import type { Task } from "@/entities/tasks/api/taskTypes";
import styles from "./TaskCard.module.scss";

type Props = {
  task: Task;
  onClick?: () => void;
};

const TaskCard: React.FC<Props> = ({ task, onClick }) => {
  const priorityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    urgent: "#ef4444",
  };

  const statusColors = {
    pending: "#94a3b8",
    in_progress: "#3b82f6",
    completed: "#10b981",
    cancelled: "#6b7280",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} kun kechikkan`;
    } else if (diffDays === 0) {
      return "Bugun";
    } else if (diffDays === 1) {
      return "Ertaga";
    } else {
      return `${diffDays} kundan keyin`;
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div
          className={styles.priority}
          style={{ backgroundColor: priorityColors[task.priority] }}
        >
          {task.priority_display}
        </div>
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Xodim:</span>
          <span className={styles.value}>{task.assigned_to_name}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Do'kon:</span>
          <span className={styles.value}>{task.store_name}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.label}>Muddat:</span>
          <span
            className={`${styles.value} ${task.is_overdue ? styles.overdue : ""}`}
          >
            {formatDate(task.deadline)}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <div
          className={styles.status}
          style={{ backgroundColor: statusColors[task.status] }}
        >
          {task.status_display}
        </div>

        {task.comments_count > 0 && (
          <div className={styles.comments}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 10.6667C14 11.0203 13.8595 11.3594 13.6095 11.6095C13.3594 11.8595 13.0203 12 12.6667 12H4.66667L2 14.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V10.6667Z"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{task.comments_count}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
