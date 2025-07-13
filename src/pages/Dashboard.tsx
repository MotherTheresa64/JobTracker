import { useJobContext } from "../context/useJobContext";
import DroppableColumn from "../components/DroppableColumn";
import DragDropContext from "../components/DragDropContext";
import type { JobStatus } from "../context/JobContext";
import { useState } from "react";

const statusOrder: JobStatus[] = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
];

const Dashboard = () => {
  const { jobs } = useJobContext();
  const [mobileStatus, setMobileStatus] = useState<JobStatus>("wishlist");

  return (
    <div className="w-full px-4 md:px-10 pt-24">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6">🎯 Job Tracker 2025</h1>

      {/* Mobile Filter */}
      <div className="block xl:hidden mb-6">
        <label htmlFor="statusFilter" className="text-white text-sm block mb-2">
          Select Column:
        </label>
        <select
          id="statusFilter"
          value={mobileStatus}
          onChange={(e) => setMobileStatus(e.target.value as JobStatus)}
          className="w-full bg-zinc-800 text-white border border-zinc-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {statusOrder.map((status) => (
            <option key={status} value={status}>
              {status.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban Board */}
      <DragDropContext>
        {(hoveredColumn, activeId, activeJob, tempJobState) => (
          <>
            {/* Mobile View: Single Column */}
            <div className="block xl:hidden">
              <DroppableColumn
                key={mobileStatus}
                title={mobileStatus}
                jobs={jobs.filter((j) => j.status === mobileStatus)}
                isHovered={hoveredColumn === mobileStatus}
                activeId={activeId}
                tempJobState={tempJobState}
              />
            </div>

            {/* Desktop View: Full Grid */}
            <div className="hidden xl:grid grid-cols-5 gap-4 w-full">
              {statusOrder.map((status) => (
                <DroppableColumn
                  key={status}
                  title={status}
                  jobs={jobs.filter((j) => j.status === status)}
                  isHovered={hoveredColumn === status}
                  activeId={activeId}
                  tempJobState={tempJobState}
                />
              ))}
            </div>
          </>
        )}
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
