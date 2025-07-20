import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Job } from "../context/JobContext";
import { useJobContext } from "../context/useJobContext";
import { useState, useMemo, type CSSProperties } from "react";
import EditJobModal from "./EditJobModal";

interface Props {
  job: Job;
  index: number;
  isDragging?: boolean;
  isOverlay?: boolean;
  isGhost?: boolean;
}

const SortableJobCard = ({
  job,
  index,
  isDragging = false,
  isOverlay = false,
  isGhost = false,
}: Props) => {
  const { deleteJob, moveJob } = useJobContext();
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: job.id,
    data: {
      columnId: job.status,
      index,
    },
    disabled: isGhost, // Prevents DnD hooks from triggering for ghost placeholder
  });

  const style: CSSProperties = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition: isGhost ? "none" : transition,
    zIndex: isOverlay ? 999 : "auto",
    opacity: isDragging && !isOverlay ? 0 : 1,
    pointerEvents: isGhost ? "none" : undefined,
    filter: isGhost ? "opacity(0.3)" : undefined,
  }), [transform, transition, isGhost, isDragging, isOverlay]);

  if (isGhost) {
    return (
      <div
        ref={setNodeRef}
        style={{
          height: "96px",
          backgroundColor: "#3f3f46",
          border: "1px dashed #71717a",
          borderRadius: "0.75rem",
          opacity: 0.3,
          pointerEvents: "none",
        }}
        className="w-full"
      />
    );
  }

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={{ height: "96px" }}
        className="w-full"
      />
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-card-dark border border-zinc-600 text-white p-4 rounded-xl shadow-md transition-transform duration-150 hover:scale-[1.01] relative"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold truncate">{job.title}</h3>
            <p className="text-xs text-gray-400 truncate">{job.company}</p>
          </div>

          {!isOverlay && (
            <div
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              className="hidden md:block text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing text-xl"
              title="Drag to reorder"
            >
              ⠿
            </div>
          )}
        </div>

        {job.link && (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-xs underline block mt-2 hover:text-blue-300 transition"
          >
            🔗 View Posting
          </a>
        )}

        {job.notes && (
          <div className="relative mt-2 max-h-[4.5em] overflow-hidden text-xs text-gray-400">
            <p className="line-clamp-3 pr-1 italic">🗃️ {job.notes}</p>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-card-dark to-transparent pointer-events-none" />
          </div>
        )}

        {!isOverlay && (
          <>
            <div className="mt-3 flex gap-4 text-xs font-medium">
              <button
                onClick={() => setIsEditing(true)}
                className="text-yellow-400 hover:text-yellow-300 transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this job?")) deleteJob(job.id);
                }}
                className="text-red-400 hover:text-red-300 transition"
              >
                🧾 Delete
              </button>
            </div>

            {/* 📱 Mobile Dropdown */}
            <div className="block md:hidden mt-4">
              <div className="text-xs text-zinc-400 mb-1">Change Status</div>
              <div className="relative">
                <select
                  value={job.status}
                  onChange={(e) => moveJob(job.id, e.target.value as Job["status"])}
                  className="w-full appearance-none bg-zinc-800 border border-zinc-600 text-sm text-white px-3 py-2 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  <option value="wishlist">⭐ Wishlist</option>
                  <option value="applied">📤 Applied</option>
                  <option value="interview">📞 Interview</option>
                  <option value="offer">🎉 Offer</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ⌄
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {!isOverlay && isEditing && (
        <EditJobModal job={job} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
};

export default SortableJobCard;
