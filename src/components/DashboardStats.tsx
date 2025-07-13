// src/components/DashboardStats.tsx
import { useJobContext } from "../context/useJobContext";

const DashboardStats = () => {
  const { jobs } = useJobContext();

  const total = jobs.length;
  const counts = {
    wishlist: jobs.filter((j) => j.status === "wishlist").length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };

  const cardBase =
    "rounded-xl p-4 text-sm md:text-base font-semibold flex items-center justify-between shadow-md backdrop-blur-sm border";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-white mb-8">
      <div className={`${cardBase} bg-zinc-800/80 border-zinc-700`}>
        📋 <span className="ml-auto">Total: <strong>{total}</strong></span>
      </div>
      <div className={`${cardBase} bg-purple-700/80 border-purple-500`}>
        ⭐ <span className="ml-auto">Wishlist: <strong>{counts.wishlist}</strong></span>
      </div>
      <div className={`${cardBase} bg-blue-700/80 border-blue-500`}>
        📨 <span className="ml-auto">Applied: <strong>{counts.applied}</strong></span>
      </div>
      <div className={`${cardBase} bg-yellow-500/90 text-black border-yellow-600`}>
        🗣️ <span className="ml-auto">Interview: <strong>{counts.interview}</strong></span>
      </div>
      <div className={`${cardBase} bg-green-700/80 border-green-500`}>
        🎉 <span className="ml-auto">Offer: <strong>{counts.offer}</strong></span>
      </div>
      <div className={`${cardBase} bg-red-700/80 border-red-500`}>
        ❌ <span className="ml-auto">Rejected: <strong>{counts.rejected}</strong></span>
      </div>
    </div>
  );
};

export default DashboardStats;
