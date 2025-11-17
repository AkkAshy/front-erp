import { useState, type FC, useEffect } from "react";
import CreateModal from "@/shared/ui/CreateModal";
import type { TaskPriority } from "@/entities/tasks/api/taskTypes";

//scss
import styles from "./AddTaskModal.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    assigned_to: number;
    priority: TaskPriority;
    deadline: string;
    store: number;
  }) => void;
  users: Array<{ id: number; full_name: string }>;
  stores: Array<{ id: string; name: string }>;
  isLoading?: boolean;
};

const AddTaskModal: FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  users,
  stores,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<number | "">("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [deadline, setDeadline] = useState("");
  const [storeId, setStoreId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setPriority("medium");
      setDeadline("");
      setStoreId("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      setError("Vazifa nomini kiriting");
      return;
    }

    if (!assignedTo) {
      setError("Xodimni tanlang");
      return;
    }

    if (!deadline) {
      setError("Muddatni kiriting");
      return;
    }

    if (!storeId) {
      setError("Do'konni tanlang");
      return;
    }

    // Check if deadline is in the future
    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Muddat bugundan keyin bo'lishi kerak");
      return;
    }

    setError(null);
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      assigned_to: assignedTo,
      priority,
      deadline,
      store: Number(storeId),
    });
  };

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={(e) => {
        e?.stopPropagation();
        onClose();
      }}
      headTitle="Yangi vazifa yaratish"
      btnTitle={isLoading ? "Yuklanmoqda..." : "Yaratish"}
      btnOnClick={(e) => {
        e?.stopPropagation();
        handleSubmit();
      }}
      height={680}
      width={600}
      overflowY="auto"
    >
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Vazifa nomi *</label>
          <input
            value={title}
            onChange={(e) => {
              setError(null);
              setTitle(e.target.value);
            }}
            className={styles.input}
            type="text"
            placeholder="Vazifa nomini kiriting"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Tavsif</label>
          <textarea
            value={description}
            onChange={(e) => {
              setError(null);
              setDescription(e.target.value);
            }}
            className={styles.textarea}
            placeholder="Vazifa haqida batafsil ma'lumot"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Xodim *</label>
          <select
            value={assignedTo}
            onChange={(e) => {
              setError(null);
              setAssignedTo(Number(e.target.value));
            }}
            className={styles.select}
            disabled={isLoading}
          >
            <option value="">Xodimni tanlang</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Do'kon *</label>
          <select
            value={storeId}
            onChange={(e) => {
              setError(null);
              setStoreId(Number(e.target.value));
            }}
            className={styles.select}
            disabled={isLoading}
          >
            <option value="">Do'konni tanlang</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Muhimlik darajasi *</label>
          <select
            value={priority}
            onChange={(e) => {
              setError(null);
              setPriority(e.target.value as TaskPriority);
            }}
            className={styles.select}
            disabled={isLoading}
          >
            <option value="low">Past</option>
            <option value="medium">O'rta</option>
            <option value="high">Yuqori</option>
            <option value="urgent">Juda muhim</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Muddat *</label>
          <input
            value={deadline}
            onChange={(e) => {
              setError(null);
              setDeadline(e.target.value);
            }}
            className={styles.input}
            type="date"
            disabled={isLoading}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </CreateModal>
  );
};

export default AddTaskModal;
