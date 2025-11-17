import { useEffect, useState, type FC } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";

import SortableItem from "../SortableItem";

type Props = {
  summaryItems: {
    id: number;
    title: string;
    change: string;
    value: string;
  }[];
};
const STORAGE_KEY = "summary_order";

const HorizontalDnd: FC<Props> = ({ summaryItems }) => {
  // const [items, setItems] = useState(summaryItems);
  const [order, setOrder] = useState<number[]>([]);

  const handleDragEnd = (event:DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrder((prev) => {
        const oldIndex = prev.indexOf(Number(active.id));
        const newIndex = prev.indexOf(Number(over.id));
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const style = {
    display: "flex",
    gap: "32px",
    marginTop: "30px",
  };

  useEffect(() => {
    const summaryIds = summaryItems.map((item) => item.id);
    const savedOrder = localStorage.getItem(STORAGE_KEY);

    let newOrder: number[] = [];

    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder) as number[];
        // оставляем только актуальные id
        newOrder = parsed.filter((id) => summaryIds.includes(id));
        // добавляем новые id в конец
        const newIds = summaryIds.filter((id) => !newOrder.includes(id));
        newOrder = [...newOrder, ...newIds];
      } catch {
        newOrder = summaryIds;
      }
    } else {
      newOrder = summaryIds;
    }

    setOrder(newOrder);
  }, [summaryItems]);

  useEffect(() => {
    if (order.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    }
  }, [order]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  const orderedItems = order
    .map((id) => summaryItems.find((i) => i.id === id))
    .filter(Boolean);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={order} strategy={horizontalListSortingStrategy}>
        <ul style={style}>
          {orderedItems?.map((item) => (
            <SortableItem key={item!.id} item={item!} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default HorizontalDnd;
