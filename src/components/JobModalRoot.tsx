// src/components/JobModalRoot.tsx
import { useJobModal } from "../hooks/useJobModal";
import AddJobForm from "./AddJobForm";

const JobModalRoot = () => {
  const { isAddJobModalOpen } = useJobModal();
  return isAddJobModalOpen ? <AddJobForm /> : null;
};

export default JobModalRoot;
