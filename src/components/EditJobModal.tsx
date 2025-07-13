// src/components/EditJobModal.tsx
import { useState, useRef, useEffect } from "react";
import type { Job, JobStatus } from "../context/JobContext";
import { useJobContext } from "../context/useJobContext";

interface Props {
  job: Job;
  onClose: () => void;
}

const EditJobModal = ({ job, onClose }: Props) => {
  const { editJob } = useJobContext();
  const modalRef = useRef<HTMLFormElement>(null);

  const [title, setTitle] = useState(job.title);
  const [company, setCompany] = useState(job.company);
  const [link, setLink] = useState(job.link || "");
  const [notes, setNotes] = useState(job.notes || "");
  const [status, setStatus] = useState<JobStatus>(job.status);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editJob(job.id, { title, company, status, link, notes });
    onClose();
  };

  // 🔐 Escape or click outside to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 w-full max-w-md p-6 rounded-xl shadow-2xl border border-zinc-700 animate-fade-in"
      >
        <h2 className="text-2xl font-bold text-white mb-4">✏️ Edit Job</h2>

        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="wishlist">📋 Wishlist</option>
          <option value="applied">📤 Applied</option>
          <option value="interview">🗣️ Interview</option>
          <option value="offer">🎉 Offer</option>
          <option value="rejected">❌ Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Link to Posting"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded transition"
          >
            💾 Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-300 hover:text-white transition"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobModal;
