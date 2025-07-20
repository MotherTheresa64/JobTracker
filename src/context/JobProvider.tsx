// src/context/JobProvider.tsx
import { useEffect, useState, useCallback } from "react";
import { JobContext, Job, JobStatus } from "./JobContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
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

  // Real‑time listener (no orderBy to avoid index requirement)
  useEffect(() => {
    if (!user) {
      setJobs([]);
      return;
    }

    const q = query(
      collection(db, "jobs"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userJobs = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Job, "id">),
          }))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setJobs(userJobs);
        setVersion((v) => v + 1);
      },
      (error) => {
        console.warn("Realtime listener error:", error);
        // Fallback: fetch unsorted then sort locally
        getDocs(q)
          .then((snapshot) => {
            const userJobs = snapshot.docs
              .map((docSnap) => ({
                id: docSnap.id,
                ...(docSnap.data() as Omit<Job, "id">),
              }))
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setJobs(userJobs);
            setVersion((v) => v + 1);
          })
          .catch((e) => console.error("Fallback fetch failed:", e));
      }
    );

    return unsubscribe;
  }, [user]);

  // No-op fetchJobs for compatibility
  const fetchJobs = useCallback(async () => {
    setVersion((v) => v + 1);
  }, []);

  const addJob = useCallback(
    async (job: Omit<Job, "id" | "userId">) => {
      if (!user) return;
      const columnJobs = jobs.filter((j) => j.status === job.status);
      const order = columnJobs.length;
      const docRef = await addDoc(collection(db, "jobs"), {
        ...job,
        userId: user.uid,
        order,
      });
      // Optimistically add to local state
      setJobs((prev) => [
        ...prev,
        { id: docRef.id, userId: user.uid, order, ...job },
      ]);
    },
    [jobs, user]
  );

  const moveJob = useCallback(
    async (jobId: string, newStatus: JobStatus) => {
      // Optimistic update
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: newStatus } : j
        )
      );
      await updateDoc(doc(db, "jobs", jobId), { status: newStatus });
    },
    []
  );

  const reorderJob = useCallback(
    async (jobId: string, newOrder: number) => {
      // Optimistic reorder in-memory
      setJobs((prev) => {
        const jobToMove = prev.find((j) => j.id === jobId);
        if (!jobToMove) return prev;
        // Extract same-status group without the moving job
        const group = prev
          .filter((j) => j.status === jobToMove.status && j.id !== jobId)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        // Insert at newOrder
        const reordered = [
          ...group.slice(0, newOrder),
          jobToMove,
          ...group.slice(newOrder),
        ];
        // Re-merge
        return prev.map((j) => {
          if (j.status === jobToMove.status) {
            const idx = reordered.findIndex((r) => r.id === j.id);
            return { ...j, order: idx };
          }
          return j;
        });
      });
      await updateDoc(doc(db, "jobs", jobId), { order: newOrder });
    },
    []
  );

  const deleteJob = useCallback(
    async (id: string) => {
      // Optimistic removal
      setJobs((prev) => prev.filter((j) => j.id !== id));
      await deleteDoc(doc(db, "jobs", id));
    },
    []
  );

  const editJob = useCallback(
    async (id: string, updated: Partial<Job>) => {
      // Optimistic edit
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, ...updated } : j))
      );
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
