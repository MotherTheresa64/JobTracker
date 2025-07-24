import React from 'react';
import { SortBy, FilterBy } from '../types';
import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterSortProps {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  filterBy: FilterBy;
  setFilterBy: (filterBy: FilterBy) => void;
}

export const FilterSort: React.FC<FilterSortProps> = ({
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Filter Section */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterBy)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Sort Section */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="priority">Priority</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
            <option value="hammered">Progress</option>
          </select>
        </div>
      </div>
    </div>
  );
};