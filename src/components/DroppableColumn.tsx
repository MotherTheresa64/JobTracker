import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import SortableJobCard from "./SortableJobCard";
import type { Job } from "../context/JobContext";
import { useJobModal } from "../hooks/useJobModal";

interface Props {
  title: string;
  jobs: Job[];
  isHovered: boolean;
  activeId?: string | null;
  tempJobState?: { id: string; newStatus: string; newIndex: number } | null;
  version?: number; // 🔄 added to track order/status updates
}

const statusStyles: Record<string, { gradient: string; icon: string }> = {
  wishlist: { gradient: "from-indigo-500 to-blue-500", icon: "⭐" },
  applied: { gradient: "from-purple-600 to-pink-500", icon: "📤" },
  interview: { gradient: "from-yellow-500 to-orange-500", icon: "📞" },
  offer: { gradient: "from-green-500 to-emerald-500", icon: "🎉" },
  rejected: { gradient: "from-red-600 to-rose-500", icon: "❌" },
};

const DroppableColumn = ({
  title,
  jobs,
  isHovered,
  activeId,
  tempJobState,
  version, // ✅ force re-compute sortedJobs when order/status changes
}: Props) => {
  const { openModal } = useJobModal();

  const { setNodeRef } = useDroppable({
    id: title,
    data: {
      columnId: title,
      index: jobs.length,
    },
  });

  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs, version] // ✅ ensure reactivity
  );

  const isDropTarget =
    isHovered && tempJobState?.newStatus === title;

  const jobAlreadyExists = useMemo(() => {
    return sortedJobs.some((job) => job.id === tempJobState?.id);
  }, [sortedJobs, tempJobState]);

  const displayJobs = useMemo(() => {
    const cloned = [...sortedJobs];

    if (
      isDropTarget &&
      tempJobState &&
      !jobAlreadyExists &&
      !cloned.find((job) => job.id === tempJobState.id)
    ) {
      cloned.splice(tempJobState.newIndex, 0, {
        id: tempJobState.id,
        title: "Dragging...",
        company: "",
        status: title,
      } as Job);
    }

    return cloned;
  }, [sortedJobs, isDropTarget, tempJobState, title, jobAlreadyExists]);

  const sortableItems = useMemo(
    () => displayJobs.map((job) => job.id),
    [displayJobs]
  );

  const { gradient, icon } = statusStyles[title] || {
    gradient: "from-gray-600 to-gray-800",
    icon: "🗂️",
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-xl overflow-hidden border border-zinc-700 bg-card-dark shadow-md transition-all duration-300 ${
        isHovered ? "ring-2 ring-purple-500" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${gradient} px-4 py-3 text-white text-sm font-bold uppercase tracking-wide flex justify-between items-center`}
      >
        <span>
          {icon} {title} ({jobs.length})
        </span>
        <span className="text-lg text-white/70">⋮</span>
      </div>

      {/* Job Cards */}
      <div className="flex flex-col gap-4 px-4 py-4 min-h-[200px] flex-1">
        <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
          {displayJobs.map((job, index) => {
            const isGhost =
              tempJobState?.id === job.id &&
              tempJobState?.newStatus === title &&
              !jobAlreadyExists;

            return (
              <SortableJobCard
                key={`${job.id}-${index}`}
                job={job}
                index={index}
                isDragging={activeId === job.id}
                isOverlay={false}
                isGhost={!!isGhost}
              />
            );
          })}
        </SortableContext>

        {/* Add Job Box */}
        <div
          onClick={() => openModal(title as Job["status"])}
          className="border-2 border-dashed border-zinc-500 text-gray-300 text-sm py-6 text-center rounded-md hover:bg-zinc-800 hover:text-white cursor-pointer transition duration-200"
        >
          + Add job
        </div>
      </div>
    </div>
  );
};

export default DroppableColumn;
