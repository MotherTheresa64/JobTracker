import { useState } from "react";
import type { Job } from "../context/JobContext";
import { useJobContext } from "../context/useJobContext";
import EditJobModal from "./EditJobModal";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface Props {
  job: Job;
  isOverlay?: boolean;
}

const JobCard = ({ job, isOverlay = false }: Props) => {
  const { deleteJob } = useJobContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this job?")) {
      await deleteJob(job.id);
    }
  };

  return (
    <>
      <div
        className={`relative bg-zinc-900 border border-zinc-700 rounded-lg p-4 shadow transition ${
          isOverlay
            ? "opacity-90 scale-[1.01] cursor-grabbing pointer-events-none"
            : "hover:shadow-lg group"
        }`}
        onMouseDown={(e) => {
          if (!isOverlay) e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{String(job.title ?? "")}</h3>
            <p className="text-sm text-zinc-400 truncate">{String(job.company ?? "")}</p>
          </div>

          {!isOverlay && (
            <GripVertical className="text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing" />
          )}
        </div>

        {job.link && typeof job.link === "string" && (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 text-sm mt-2 hover:underline"
          >
            🔗 View Posting
          </a>
        )}

        {job.notes && typeof job.notes === "string" && (
          <div className="relative mt-1 max-h-[4.5em] overflow-hidden text-xs text-zinc-400">
            <p className="line-clamp-3 pr-1">🗃️ {job.notes}</p>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
          </div>
        )}

        {!isOverlay && (
          <div className="flex justify-between mt-4 text-sm">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-500 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      {!isOverlay && isEditing && (
        <EditJobModal job={job} onClose={() => setIsEditing(false)} />
      )}
    </>
  );
};

export default JobCard;
