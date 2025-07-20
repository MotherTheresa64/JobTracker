// src/context/JobProvider.tsx
import { useEffect, useState, useCallback } from "react";
import { JobContext, Job, JobStatus } from "./JobContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthContext } from "./useAuthContext";

const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [version, setVersion] = useState<number>(0);

  // Real‑time listener (no orderBy, sort client‑side)
  useEffect(() => {
    if (!user) {
      setJobs([]);
      return;
    }
    const q = query(
      collection(db, "jobs"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Job, "id">) }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setJobs(list);
      setVersion((v) => v + 1);
    });
    return unsubscribe;
  }, [user]);

  // no-op to satisfy signature
  const fetchJobs = useCallback(async () => {
    setVersion((v) => v + 1);
  }, []);

  const addJob = useCallback(
    async (job: Omit<Job, "id" | "userId">) => {
      if (!user) return;
      const columnJobs = jobs.filter((j) => j.status === job.status);
      const order = columnJobs.length;
      await addDoc(collection(db, "jobs"), {
        ...job,
        userId: user.uid,
        order,
      });
    },
    [jobs, user]
  );

  const moveJob = useCallback(
    async (jobId: string, newStatus: JobStatus) => {
      await updateDoc(doc(db, "jobs", jobId), { status: newStatus });
    },
    []
  );

  const reorderJob = useCallback(
    async (jobId: string, newOrder: number) => {
      await updateDoc(doc(db, "jobs", jobId), { order: newOrder });
    },
    []
  );

  const deleteJob = useCallback(
    async (id: string) => {
      await deleteDoc(doc(db, "jobs", id));
    },
    []
  );

  const editJob = useCallback(
    async (id: string, updated: Partial<Job>) => {
      await updateDoc(doc(db, "jobs", id), updated);
    },
    []
  );

  return (
    <JobContext.Provider
      value={{
        jobs,
        version,
        fetchJobs,
        addJob,
        moveJob,
        reorderJob,
        deleteJob,
        editJob,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
