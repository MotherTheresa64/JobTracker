import { createContext } from "react";
import type { JobStatus } from "./JobContext";

export interface JobModalContextType {
  isAddJobModalOpen: boolean;
  openModal: (status: JobStatus) => void;
  closeModal: () => void;
  statusForModal: JobStatus;
}

export const JobModalContext = createContext<JobModalContextType | undefined>(undefined);
 