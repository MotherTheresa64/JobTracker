import {
  DndContext,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  closestCenter,
  Over,
} from "@dnd-kit/core";
import { useState } from "react";
import { useJobContext } from "../context/useJobContext";
import type { Job } from "../context/JobContext";
import JobCard from "./JobCard";

const DragDropContext = ({
  children,
}: {
  children: (
    hoveredColumn: string | null,
    activeId: string | null,
    activeJob?: Job,
    tempJobState?: { id: string; newStatus: string } | null
  ) => React.ReactNode;
}) => {
  const { jobs, moveJob } = useJobContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [tempJobState, setTempJobState] = useState<{
    id: string;
    newStatus: string;
  } | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: { over: Over | null }) => {
    const overId = event.over?.id;
    if (typeof overId === "string") {
      setHoveredColumn(overId);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const jobId = String(active.id);
    const newStatus = over?.id;

    if (typeof newStatus !== "string") {
      resetDrag();
      return;
    }

    const job = jobs.find((j) => j.id === jobId);
    if (job && job.status !== newStatus) {
      // ⏩ Optimistically update UI
      setTempJobState({ id: jobId, newStatus });

      // ⌛ Then call backend/state
      await moveJob(jobId, newStatus as Job["status"]);
    }

    resetDrag();
  };

  const resetDrag = () => {
    setTimeout(() => {
      setActiveId(null);
      setHoveredColumn(null);
      setTempJobState(null);
    }, 50);
  };

  const activeJob = jobs.find((job) => job.id === activeId);

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
