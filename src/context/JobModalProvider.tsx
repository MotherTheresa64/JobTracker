import { useState } from "react";
import { JobModalContext } from "./JobModalContext";
import type { JobStatus } from "./JobContext";

export const JobModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [statusForModal, setStatusForModal] = useState<JobStatus>("wishlist");

  const openModal = (status: JobStatus) => {
    setStatusForModal(status);
    setIsAddJobModalOpen(true);
  };

  const closeModal = () => {
    setIsAddJobModalOpen(false);
  };

  return (
    <JobModalContext.Provider
      value={{ isAddJobModalOpen, openModal, closeModal, statusForModal }}
    >
      {children}
    </JobModalContext.Provider>
  );
};
 