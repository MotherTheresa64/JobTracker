import { useEffect, useState, useCallback } from "react";
import { JobContext, Job, JobStatus } from "./JobContext";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthContext } from "./useAuthContext";

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useAuthContext();

  // ✅ Safe and correct dependency handling
  const fetchJobs = useCallback(async () => {
    if (!user) return;

    const snapshot = await getDocs(collection(db, "jobs"));
    const userJobs: Job[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.userId === user.uid) {
        userJobs.push({ ...(data as Omit<Job, "id">), id: docSnap.id });
      }
    });

    setJobs(userJobs);
  }, [user]);

  const addJob = async (job: Omit<Job, "id" | "userId">) => {
    if (!user) return;
    await addDoc(collection(db, "jobs"), { ...job, userId: user.uid });
    await fetchJobs();
  };

  const moveJob = async (jobId: string, status: JobStatus) => {
    await updateDoc(doc(db, "jobs", jobId), { status });
    await fetchJobs();
  };

  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, "jobs", id));
    await fetchJobs();
  };

  const editJob = async (id: string, updated: Partial<Job>) => {
    await updateDoc(doc(db, "jobs", id), updated);
    await fetchJobs();
  };

  // ✅ Re-fetch when user logs in
  useEffect(() => {
    if (user) fetchJobs();
  }, [user, fetchJobs]);

  return (
    <JobContext.Provider
      value={{ jobs, addJob, moveJob, fetchJobs, deleteJob, editJob }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
