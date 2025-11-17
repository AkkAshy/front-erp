import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

//scss
import styles from "./SortableItem.module.scss";
import type { FC } from "react";

type Props = {
  item: {
    id: number;
    title: string;
    change: string;
    value: string;
  };
};

const SortableItem: FC<Props> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <li
      ref={setNodeRef}
      className={styles.summary__item}
      {...attributes}
      {...listeners}
      style={style}
    >
      <p className={styles.title}>{item.title}</p>
      <span
        className={clsx(
          styles.change,
          item.change?.includes("+") && styles.grow
        )}
      >
        {item.change}
      </span>
      <span className={styles.value}>{item.value}</span>
    </li>
  );
};

export default SortableItem;
