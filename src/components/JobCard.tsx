import { useDraggable } from "@dnd-kit/core";
import type { Job } from "../context/JobContext";
import { useJobContext } from "../context/useJobContext";
import { useState } from "react";
import EditJobModal from "./EditJobModal";

interface Props {
  job: Job;
  isOverlay?: boolean;
}

const JobCard = ({ job, isOverlay = false }: Props) => {
  const { deleteJob } = useJobContext();
  const [editing, setEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isOverlay ? "transform 150ms ease" : undefined,
      }
    : undefined;

  if (isDragging && !isOverlay) return null;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={`bg-card-dark border border-zinc-600 text-white p-4 rounded-xl shadow-md transition-transform duration-200 hover:scale-[1.01] relative animate-slide-up ${
        isOverlay ? "opacity-90 scale-105" : ""
      }`}
    >
      {/* Top section: title + drag */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-semibold truncate">{job.title}</h3>
          <p className="text-xs text-gray-400 truncate">{job.company}</p>
        </div>
        <div
          {...listeners}
          className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing text-xl"
          title="Drag to move"
        >
          ⠿
        </div>
      </div>

      {/* Link */}
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

      {/* Notes */}
      {job.notes && (
        <p className="text-xs mt-2 text-gray-400 italic leading-snug">
          🗃️ {job.notes}
        </p>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-4 text-xs font-medium">
        <button
          onClick={() => setEditing(true)}
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

      {/* Modal */}
      {editing && <EditJobModal job={job} onClose={() => setEditing(false)} />}
    </div>
  );
};

export default JobCard;
