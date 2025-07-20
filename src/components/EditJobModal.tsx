import { useState, useRef, useEffect } from "react";
import type { Job, JobStatus } from "../context/JobContext";
import { useJobContext } from "../context/useJobContext";

interface Props {
  job: Job;
  onClose: () => void;
}

const EditJobModal = ({ job, onClose }: Props) => {
  const { editJob } = useJobContext();

  const [title, setTitle] = useState(job.title);
  const [company, setCompany] = useState(job.company);
  const [link, setLink] = useState(job.link || "");
  const [notes, setNotes] = useState(job.notes || "");
  const [status, setStatus] = useState<JobStatus>(job.status);

  const modalRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editJob(job.id, { title, company, status, link, notes });
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 text-white w-full max-w-md p-6 rounded-xl shadow-2xl border border-zinc-700 animate-fade-in"
      >
        <h2 className="text-2xl font-bold mb-4">
          ✏️ Edit Job{" "}
          <span className="ml-1 text-sm font-normal text-purple-400 uppercase">
            ({status})
          </span>
        </h2>

        <label htmlFor="edit-title" className="sr-only">Job Title</label>
        <input
          id="edit-title"
          name="title"
          type="text"
          autoComplete="job-title"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label htmlFor="edit-company" className="sr-only">Company</label>
        <input
          id="edit-company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label htmlFor="edit-status" className="sr-only">Status</label>
        <select
          id="edit-status"
          name="status"
          autoComplete="off"
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="wishlist">📋 Wishlist</option>
          <option value="applied">📤 Applied</option>
          <option value="interview">📞 Interview</option>
          <option value="offer">🎉 Offer</option>
          <option value="rejected">❌ Rejected</option>
        </select>

        <label htmlFor="edit-link" className="sr-only">Job Link</label>
        <input
          id="edit-link"
          name="link"
          type="url"
          autoComplete="url"
          placeholder="Link to Posting"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <label htmlFor="edit-notes" className="sr-only">Notes</label>
        <textarea
          id="edit-notes"
          name="notes"
          placeholder="Notes"
          autoComplete="off"
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
