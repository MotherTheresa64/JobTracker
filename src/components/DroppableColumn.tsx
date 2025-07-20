import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useMemo } from "react";
import SortableJobCard from "./SortableJobCard";
import type { Job, JobStatus } from "../context/JobContext";
import { useJobModal } from "../hooks/useJobModal";
import { Plus } from "lucide-react";

interface Props {
  title: JobStatus;
  jobs: Job[];
  isHovered: boolean;
  activeId?: string | null;
  tempJobState?: { id: string; newStatus: JobStatus; newIndex: number } | null;
}

const statusStyles: Record<JobStatus, { gradient: string; icon: string }> = {
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
}: Props) => {
  const { openModal } = useJobModal();

  const { setNodeRef } = useDroppable({
    id: title,
    data: {
      columnId: title,
      index: jobs.length,
    },
  });

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [jobs]);

  const isDropTarget = isHovered && tempJobState?.newStatus === title;

  const jobAlreadyExists = useMemo(() => {
    return sortedJobs.some((job) => job.id === tempJobState?.id);
  }, [sortedJobs, tempJobState]);

  const displayJobs = useMemo(() => {
    const cloned = [...sortedJobs];

    if (
      isDropTarget &&
      tempJobState &&
      !jobAlreadyExists
    ) {
      // Create a valid ghost job with userId fallback
      cloned.splice(tempJobState.newIndex, 0, {
        id: tempJobState.id,
        title: "Dragging...",
        company: "",
        status: title,
        order: 0,
        link: "",
        notes: "",
        userId: "ghost", // satisfies Job type
      } as Job);
    }

    return cloned;
  }, [sortedJobs, isDropTarget, tempJobState, jobAlreadyExists, title]);

  const sortableItems = useMemo(
    () => displayJobs.map((job) => job.id),
    [displayJobs]
  );

  const { gradient, icon } = statusStyles[title];

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
          {icon} {title} ({sortedJobs.length})
        </span>

        <button
          onClick={() => openModal(title)}
          title="Add new job"
          className="p-1.5 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition hover:scale-110 animate-pulse"
          aria-label={`Add job to ${title}`}
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Job List */}
      <div className="flex flex-col gap-4 px-4 py-4 min-h-[200px] flex-1">
        <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
          {displayJobs.map((job, index) => {
            const isGhost =
              tempJobState?.id === job.id &&
              tempJobState?.newStatus === title &&
              !jobAlreadyExists;

            const isDragging = activeId === job.id;

            if (!isGhost && isDragging) return null;

            try {
              return (
                <SortableJobCard
                  key={`${job.id}-${index}`}
                  job={job}
                  index={index}
                  isDragging={isDragging}
                  isOverlay={false}
                  isGhost={isGhost}
                />
              );
            } catch (err) {
              console.error("❌ Failed to render job card:", job, err);
              return <div className="text-red-500">Error rendering job</div>;
            }
          })}
        </SortableContext>
      </div>
    </div>
  );
};

export default DroppableColumn;
