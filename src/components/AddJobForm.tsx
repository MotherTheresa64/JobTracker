import { useEffect, useRef, useState } from "react";
import { useJobContext } from "../context/useJobContext";
import { useJobModal } from "../hooks/useJobModal";

const AddJobForm = () => {
  const { addJob } = useJobContext();
  const { closeModal, statusForModal } = useJobModal();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const modalRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    await addJob({
      title: title.trim(),
      company: company.trim(),
      status: statusForModal,
      link: link.trim(),
      notes: notes.trim(),
    });

    setTitle("");
    setCompany("");
    setLink("");
    setNotes("");
    closeModal();
  };

  // 🔐 Close on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeModal]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 text-white w-full max-w-md p-6 rounded-xl shadow-2xl border border-zinc-700 animate-fade-in"
      >
        <h2 className="text-2xl font-bold mb-4">
          ➕ Add New Job
          <span className="ml-1 text-sm font-normal text-purple-400 uppercase">
            ({statusForModal})
          </span>
        </h2>

        <input
          placeholder="Job Title (max 80 chars)"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 80))}
          maxLength={80}
          required
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          placeholder="Company (max 60 chars)"
          value={company}
          onChange={(e) => setCompany(e.target.value.slice(0, 60))}
          maxLength={60}
          required
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          placeholder="Link to Posting"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full mb-3 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <textarea
          placeholder="Notes (max 200 chars)"
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 200))}
          maxLength={200}
          rows={3}
          className="w-full mb-1 bg-zinc-800 border border-zinc-600 px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Optional live character count */}
        <div className="text-xs text-gray-400 mb-3 text-right">
          {notes.length}/200
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded transition"
          >
            ➕ Add Job
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="text-gray-300 hover:text-white transition"
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJobForm;
