import { createContext } from "react";

export type JobStatus = "wishlist" | "applied" | "interview" | "offer" | "rejected";

export interface Job {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
  userId: string;
  notes?: string;
  link?: string;
  order?: number;
}

export interface JobContextType {
  jobs: Job[];
  version: number; // ✅ Triggers reactivity when jobs change
  addJob: (job: Omit<Job, "id" | "userId">) => Promise<void>;
  moveJob: (jobId: string, status: JobStatus) => Promise<void>;
  reorderJob: (jobId: string, newOrder: number) => Promise<void>;
  fetchJobs: () => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  editJob: (id: string, updated: Partial<Job>) => Promise<void>;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);
