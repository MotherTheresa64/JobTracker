import { useContext } from "react";
import { JobContext } from "./JobContext";

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobContext must be used inside JobProvider");
  }
  return context;
};
