// src/context/JobProvider.tsx
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
  const [version, setVersion] = useState<number>(0); // 🔄 force re-renders
  const { user } = useAuthContext();

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
    setVersion((v) => v + 1); // 🔄 trigger re-renders
  }, [user]);

  const addJob = async (job: Omit<Job, "id" | "userId">) => {
    if (!user) return;
    const columnJobs = jobs.filter((j) => j.status === job.status);
    const order = columnJobs.length;

    await addDoc(collection(db, "jobs"), {
      ...job,
      userId: user.uid,
      order,
    });

    await fetchJobs();
  };

  const moveJob = async (jobId: string, newStatus: JobStatus) => {
    const jobToMove = jobs.find((job) => job.id === jobId);
    if (!jobToMove || jobToMove.status === newStatus) return;

    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    try {
      await updateDoc(doc(db, "jobs", jobId), { status: newStatus });
      setVersion((v) => v + 1); // 🔄 force refresh
    } catch (err) {
      console.error("Failed to update status:", err);
      await fetchJobs();
    }
  };

  const reorderJob = async (jobId: string, newOrder: number) => {
    const jobToMove = jobs.find((job) => job.id === jobId);
    if (!jobToMove) return;

    const sameStatusJobs = jobs
      .filter((job) => job.status === jobToMove.status && job.id !== jobId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const reordered = [
      ...sameStatusJobs.slice(0, newOrder),
      jobToMove,
      ...sameStatusJobs.slice(newOrder),
    ];

    const updatedJobs = jobs.map((job) => {
      const idx = reordered.findIndex((j) => j.id === job.id);
      return job.status === jobToMove.status
        ? { ...job, order: idx }
        : job;
    });

    setJobs(updatedJobs);
    setVersion((v) => v + 1); // 🔄

    for (let i = 0; i < reordered.length; i++) {
      try {
        await updateDoc(doc(db, "jobs", reordered[i].id), { order: i });
      } catch (err) {
        console.error("🔥 Failed to reorder job:", err);
      }
    }
  };

  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, "jobs", id));
    await fetchJobs();
  };

  const editJob = async (id: string, updated: Partial<Job>) => {
    await updateDoc(doc(db, "jobs", id), updated);
    await fetchJobs();
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user, fetchJobs]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        version, // 🆕 expose version
        addJob,
        moveJob,
        reorderJob,
        fetchJobs,
        deleteJob,
        editJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
