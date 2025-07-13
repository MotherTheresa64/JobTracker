import { useContext } from "react";
import { JobModalContext } from "../context/JobModalContext";

export const useJobModal = () => {
  const context = useContext(JobModalContext);
  if (!context) {
    throw new Error("useJobModal must be used within a JobModalProvider");
  }
  return context;
};
