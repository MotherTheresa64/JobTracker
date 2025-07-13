import { useDroppable } from "@dnd-kit/core";
import JobCard from "./JobCard";
import type { Job } from "../context/JobContext";
import { useJobModal } from "../hooks/useJobModal";

interface Props {
  title: string;
  jobs: Job[];
  isHovered?: boolean;
  activeId?: string | null;
  tempJobState?: { id: string; newStatus: string } | null;
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
  isHovered = false,
  activeId,
  tempJobState,
}: Props) => {
  const { setNodeRef } = useDroppable({ id: title });
  const { openModal } = useJobModal();

  const { gradient, icon } = statusStyles[title] || {
    gradient: "from-gray-600 to-gray-800",
    icon: "🗂️",
  };

  const visibleJobs = jobs.filter((job) => {
    // Hide the dragged job from all columns except its new temp destination
    if (job.id === tempJobState?.id) {
      return tempJobState.newStatus === title;
    }
    // Hide the original while dragging
    return job.id !== activeId;
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-xl overflow-hidden border border-zinc-700 bg-card-dark shadow-md animate-fade-in transition-all duration-300 ${
        isHovered ? "ring-2 ring-accent-glow scale-[1.01]" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${gradient} px-4 py-3 text-white text-sm font-bold uppercase tracking-wide flex justify-between items-center`}
      >
        <span>
          {icon} {title} ({visibleJobs.length})
        </span>
        <span className="text-lg text-white/70">⋮</span>
      </div>

      {/* Job Cards */}
      <div className="flex flex-col gap-4 px-4 py-4 min-h-[200px] flex-1">
        {visibleJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}

        {/* Add Job Box */}
        <div
          onClick={() => openModal(title as Job["status"])}
          className="border-2 border-dashed border-zinc-500 text-gray-300 text-sm py-6 text-center rounded-md hover:bg-zinc-800 hover:text-white cursor-pointer transition duration-200"
        >
          Add job
        </div>
      </div>
    </div>
  );
};

export default DroppableColumn;
