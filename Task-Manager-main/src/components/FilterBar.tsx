import React from 'react';
import { FilterType, SortType } from '../types';
import { Search, Filter, ArrowUpDown, Plus } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  sortBy: SortType;
  onSortChange: (sort: SortType) => void;
  onAddTask: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  onAddTask,
}) => {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'date', label: 'Date Created' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 mb-6 relative overflow-hidden group">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <div className="flex flex-col lg:flex-row gap-4 items-center relative z-10">
        {/* Search */}
        <div className="relative flex-1 max-w-md group/search">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 group-focus-within/search:text-blue-500 group-focus-within/search:scale-110" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:shadow-lg backdrop-blur-sm bg-white/80"
          />
          {/* Search glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-focus-within/search:opacity-20 transition-opacity duration-300 -z-10 blur-md" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 group/filter">
          <Filter size={16} className="text-gray-500 transition-all duration-300 group-hover/filter:text-blue-500 group-hover/filter:rotate-12" />
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value as FilterType)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:shadow-lg backdrop-blur-sm bg-white/80 hover:scale-105"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 group/sort">
          <ArrowUpDown size={16} className="text-gray-500 transition-all duration-300 group-hover/sort:text-purple-500 group-hover/sort:rotate-180" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortType)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:shadow-lg backdrop-blur-sm bg-white/80 hover:scale-105"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add Task Button */}
        <div className="relative group/button">
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover/button:opacity-60 transition-opacity duration-300 blur-md" />
          
          <button
          onClick={onAddTask}
            className="relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 hover:rotate-1 shadow-xl hover:shadow-2xl backdrop-blur-sm border border-white/20 font-semibold"
        >
            <Plus size={16} className="transition-transform duration-300 group-hover/button:rotate-90" />
          Add Task
          </button>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-2 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-all duration-500" />
      <div className="absolute bottom-3 left-6 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-pulse transition-all duration-700 delay-200" />
    </div>
  );
};