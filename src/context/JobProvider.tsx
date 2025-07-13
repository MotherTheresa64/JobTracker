import { useEffect, useState, useCallback } from "react";
import { JobContext, Job, JobStatus } from "./JobContext";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthContext } from "./useAuthContext";

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useAuthContext();

  // ✅ Securely fetch only jobs belonging to the current user using Firestore query
  const fetchJobs = useCallback(async () => {
    if (!user) return;

    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    const userJobs: Job[] = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as Omit<Job, "id">),
      id: docSnap.id,
    }));

    setJobs(userJobs);
  }, [user]);

  // ✅ Add a new job for the current user
  const addJob = async (job: Omit<Job, "id" | "userId">) => {
    if (!user) return;
    await addDoc(collection(db, "jobs"), { ...job, userId: user.uid });
    await fetchJobs();
  };

  // ✅ Move job between statuses
  const moveJob = async (jobId: string, status: JobStatus) => {
    await updateDoc(doc(db, "jobs", jobId), { status });
    await fetchJobs();
  };

  // ✅ Delete a job
  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, "jobs", id));
    await fetchJobs();
  };

  // ✅ Edit a job (partial update)
  const editJob = async (id: string, updated: Partial<Job>) => {
    await updateDoc(doc(db, "jobs", id), updated);
    await fetchJobs();
  };

  // ✅ Re-fetch jobs when user logs in
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
