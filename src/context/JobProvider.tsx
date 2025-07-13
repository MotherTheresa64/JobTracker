import { useEffect, useState } from "react";
import { JobContext, Job, JobStatus } from "./JobContext";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuthContext } from "./useAuthContext";

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useAuthContext();

  // 🔄 Live-sync Firestore jobs to local state
  useEffect(() => {
    if (!user) return;

    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("userId", "==", user.uid), orderBy("order"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userJobs: Job[] = snapshot.docs.map((docSnap) => ({
        ...(docSnap.data() as Omit<Job, "id">),
        id: docSnap.id,
      }));
      setJobs(userJobs);
    });

    return () => unsubscribe();
  }, [user]);

  // ➕ Add a new job with an order at the bottom of its column
  const addJob = async (job: Omit<Job, "id" | "userId">) => {
    if (!user) return;
    const columnJobs = jobs.filter((j) => j.status === job.status);
    const order = columnJobs.length;

    await addDoc(collection(db, "jobs"), {
      ...job,
      userId: user.uid,
      order,
    });
  };

  // 🔁 Move job to a different column (optimistic + persistent)
  const moveJob = async (jobId: string, newStatus: JobStatus) => {
    const jobToMove = jobs.find((job) => job.id === jobId);
    if (!jobToMove || jobToMove.status === newStatus) return;

    // Optimistic local update
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    // Persist to Firestore
    try {
      await updateDoc(doc(db, "jobs", jobId), { status: newStatus });
    } catch (err) {
      console.error("🔥 Failed to update job status:", err);
    }
  };

  // ⬆️⬇️ Reorder jobs within the same column and persist order
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
      return job.status === jobToMove.status ? { ...job, order: idx } : job;
    });

    setJobs(updatedJobs);

    // Save order to Firestore
    for (let i = 0; i < reordered.length; i++) {
      try {
        await updateDoc(doc(db, "jobs", reordered[i].id), { order: i });
      } catch (err) {
        console.error("🔥 Failed to update job order:", err);
      }
    }
  };

  const deleteJob = async (id: string) => {
    await deleteDoc(doc(db, "jobs", id));
  };

  const editJob = async (id: string, updated: Partial<Job>) => {
    await updateDoc(doc(db, "jobs", id), updated);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
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
