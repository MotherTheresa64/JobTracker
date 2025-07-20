// src/components/DragDropContext.tsx
import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  closestCenter,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { useState, useRef, useCallback } from "react";
import { useJobContext } from "../context/useJobContext";
import type { Job, JobStatus } from "../context/JobContext";
import JobCard from "./JobCard";

type TempJobMove = {
  id: string;
  newStatus: JobStatus;
  newIndex: number;
};

/**
 * A throttle helper for void-returning functions.
 * Limits calls to `fn` to once per `wait` ms.
 */
function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number
): (...args: Args) => void {
  let last = 0;
  return (...args: Args) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}

const DragDropContext = ({
  children,
}: {
  children: (
    hoveredColumn: string | null,
    activeId: string | null,
    activeJob?: Job,
    tempJobState?: TempJobMove | null
  ) => React.ReactNode;
}) => {
  const { jobs, moveJob, reorderJob, fetchJobs } = useJobContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [tempJobState, setTempJobState] = useState<TempJobMove | null>(null);

  const activeJob = jobs.find((job) => job.id === activeId);

  const resetDrag = useCallback(() => {
    setActiveId(null);
    setHoveredColumn(null);
    setTempJobState(null);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // Throttle state updates to at most once every 50ms
  const throttledUpdate = useRef(
    throttle(
      (columnId: string, index: number, id: string) => {
        setHoveredColumn(columnId);
        setTempJobState((prev) =>
          prev?.id === id && prev.newStatus === columnId && prev.newIndex === index
            ? prev
            : { id, newStatus: columnId as JobStatus, newIndex: index }
        );
      },
      50
    )
  ).current;

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const over = event.over?.data?.current;
      if (!over || !activeId) return;
      const { columnId, index } = over;
      if (typeof columnId === "string" && typeof index === "number") {
        throttledUpdate(columnId, index, activeId);
      }
    },
    [activeId, throttledUpdate]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over?.data?.current) {
        resetDrag();
        return;
      }

      const jobId = String(active.id);
      const newStatus = over.data.current.columnId as JobStatus;
      const newIndex = over.data.current.index;

      const job = jobs.find((j) => j.id === jobId);
      if (!job) {
        resetDrag();
        return;
      }

      try {
        if (job.status !== newStatus) {
          await moveJob(jobId, newStatus);
        }
        await reorderJob(jobId, newIndex);
      } catch (err) {
        console.error("❌ Drag update failed:", err);
      } finally {
        setTimeout(fetchJobs, 100);
        resetDrag();
      }
    },
    [jobs, moveJob, reorderJob, fetchJobs, resetDrag]
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      measuring={{
        droppable: { strategy: MeasuringStrategy.BeforeDragging },
      }}
    >
      {children(hoveredColumn, activeId, activeJob, tempJobState)}

      <DragOverlay>
        {activeJob && <JobCard job={activeJob} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropContext;
