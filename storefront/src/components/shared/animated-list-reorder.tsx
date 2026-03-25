"use client";

import { useState, useCallback } from "react";
import { Reorder, useDragControls, motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedListReorderProps<T> {
  /** Array of items to display. Each item must have a unique `id` field. */
  items: T[];
  /** Called when items are reordered with the new array */
  onReorder: (items: T[]) => void;
  /** Custom render function for each list item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Function to get a unique key for each item */
  getKey: (item: T) => string | number;
  /** Additional class for the list container */
  className?: string;
  /** Additional class for each list item */
  itemClassName?: string;
  /** Whether to show the drag handle grip icon (default: true) */
  showHandle?: boolean;
  /** Layout axis: "x" for horizontal, "y" for vertical (default: "y") */
  axis?: "x" | "y";
}

interface ReorderItemProps<T> {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T) => string | number;
  itemClassName?: string;
  showHandle: boolean;
}

function ReorderItem<T>({
  item,
  index,
  renderItem,
  getKey,
  itemClassName,
  showHandle,
}: ReorderItemProps<T>) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      key={getKey(item)}
      dragListener={!showHandle}
      dragControls={dragControls}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 25,
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        zIndex: 50,
      }}
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-background p-3 transition-colors",
        "cursor-grab active:cursor-grabbing",
        itemClassName
      )}
    >
      {showHandle && (
        <motion.div
          className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="h-4 w-4" />
        </motion.div>
      )}
      <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
    </Reorder.Item>
  );
}

/**
 * Drag-to-reorder list using Framer Motion's Reorder component.
 * Items animate smoothly during drag with spring physics.
 * Supports custom render function for list items and layout animations
 * for position changes.
 */
export function AnimatedListReorder<T>({
  items,
  onReorder,
  renderItem,
  getKey,
  className,
  itemClassName,
  showHandle = true,
  axis = "y",
}: AnimatedListReorderProps<T>) {
  const [, setDragActive] = useState(false);

  const handleReorder = useCallback(
    (newOrder: T[]) => {
      onReorder(newOrder);
    },
    [onReorder]
  );

  return (
    <Reorder.Group
      axis={axis}
      values={items}
      onReorder={handleReorder}
      layoutScroll
      className={cn(
        "flex flex-col gap-2",
        axis === "x" && "flex-row",
        className
      )}
    >
      {items.map((item, index) => (
        <ReorderItem
          key={getKey(item)}
          item={item}
          index={index}
          renderItem={renderItem}
          getKey={getKey}
          itemClassName={itemClassName}
          showHandle={showHandle}
        />
      ))}
    </Reorder.Group>
  );
}
