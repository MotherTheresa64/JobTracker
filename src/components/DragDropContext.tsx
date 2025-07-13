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
  const { jobs, moveJob, reorderJob } = useJobContext();
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

    if (typeof overColumnId === "string") {
      setHoveredColumn(overColumnId);
    }

    if (
      activeId &&
      typeof overColumnId === "string" &&
      typeof overIndex === "number"
    ) {
      setTempJobState({
        id: activeId,
        newStatus: overColumnId as JobStatus,
        newIndex: overIndex,
      });
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

    if (statusChanged) {
      await moveJob(jobId, newStatus);           // ✅ update status + order
      await reorderJob(jobId, newIndex);         // ✅ immediately reorder
    } else {
      await reorderJob(jobId, newIndex);         // same-column reorder
    }

    resetDrag();
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
        {activeJob && <JobCard job={activeJob} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropContext;
