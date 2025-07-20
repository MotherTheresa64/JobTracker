import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { useState } from "react";
import { useJobContext } from "../context/useJobContext";
import type { Job, JobStatus } from "../context/JobContext";
import JobCard from "./JobCard";

type TempJobMove = {
  id: string;
  newStatus: JobStatus;
  newIndex: number;
};

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const over = event.over;
    if (!over?.data?.current) return;

    const overColumnId = over.data.current.columnId;
    const overIndex = over.data.current.index;

    // Only update hovered column if it changed
    if (
      typeof overColumnId === "string" &&
      overColumnId !== hoveredColumn
    ) {
      setHoveredColumn(overColumnId);
    }

    // Only update temp job state if it changed
    if (
      activeId &&
      typeof overColumnId === "string" &&
      typeof overIndex === "number"
    ) {
      const isSame =
        tempJobState?.id === activeId &&
        tempJobState?.newStatus === overColumnId &&
        tempJobState?.newIndex === overIndex;

      if (!isSame) {
        setTempJobState({
          id: activeId,
          newStatus: overColumnId as JobStatus,
          newIndex: overIndex,
        });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
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

    const statusChanged = job.status !== newStatus;

    try {
      if (statusChanged) {
        await moveJob(jobId, newStatus);
      }
      await reorderJob(jobId, newIndex);
    } catch (err) {
      console.error("Drag update failed:", err);
    } finally {
      setTimeout(() => {
        fetchJobs();
      }, 100);

      resetDrag();
    }
  };

  const resetDrag = () => {
    setActiveId(null);
    setHoveredColumn(null);
    setTempJobState(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      {children(hoveredColumn, activeId, activeJob, tempJobState)}

      <DragOverlay>
        {activeJob ? (
          <JobCard job={activeJob} isOverlay />
        ) : (
          <div className="text-red-500 text-sm px-2 py-1 bg-zinc-800 rounded shadow">
            Invalid job
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropContext;
