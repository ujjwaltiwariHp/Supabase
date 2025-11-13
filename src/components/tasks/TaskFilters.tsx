'use client';

import React from 'react';
import Card from '@/components/ui/Card'; //
import Button from '@/components/ui/Button'; //
import { ListFilter, SlidersHorizontal, SortAsc } from 'lucide-react';
import {
  useTasks,
  TaskFilter,
  PriorityFilter,
  TaskSort,
  TaskPriority,
} from '@/lib/hooks/useTasks';

interface SelectControlProps<T extends string> {
  label: string;
  icon: React.ReactNode;
  value: T;
  onChange: (value: T) => void;
  options: { label: string; value: T }[];
}

function SelectControl<T extends string>({
  label,
  icon,
  value,
  onChange,
  options,
}: SelectControlProps<T>) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 z-10">
          {icon}
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full px-4 pl-10 py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white appearance-none transition"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function TaskFilters() {
  const {
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    sort,
    setSort,
    rawTasks,
  } = useTasks();

  const taskCount = rawTasks.length;
  const pendingCount = rawTasks.filter(t => !t.is_completed).length;
  const completedCount = taskCount - pendingCount;


  const priorityOptions: { label: string; value: PriorityFilter }[] = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High', value: 'high' as TaskPriority },
    { label: 'Medium', value: 'medium' as TaskPriority },
    { label: 'Low', value: 'low' as TaskPriority },
  ];

  const sortOptions: { label: string; value: TaskSort }[] = [
    { label: 'Newest First', value: 'created_at_desc' },
    { label: 'Oldest First', value: 'created_at_asc' },
    { label: 'Priority (High → Low)', value: 'priority_desc' },
    { label: 'Deadline (Soonest)', value: 'deadline_asc' },
  ];

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
        <ListFilter className="w-6 h-6 text-purple-500" />
        Filter & Sort Tasks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filter by Status */}
        <div className="w-full md:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <div className="flex rounded-lg border-2 border-purple-200 divide-x divide-purple-200 overflow-hidden">
            <FilterButton
              label={`All (${taskCount})`}
              value="all"
              currentValue={filter}
              onClick={setFilter}
            />
            <FilterButton
              label={`Pending (${pendingCount})`}
              value="pending"
              currentValue={filter}
              onClick={setFilter}
            />
            <FilterButton
              label={`Completed (${completedCount})`}
              value="completed"
              currentValue={filter}
              onClick={setFilter}
            />
          </div>
        </div>

        {/* Filter by Priority */}
        <SelectControl<PriorityFilter>
          label="Priority"
          icon={<SlidersHorizontal className="w-5 h-5" />}
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={priorityOptions}
        />

        {/* Sort By */}
        <SelectControl<TaskSort>
          label="Sort By"
          icon={<SortAsc className="w-5 h-5" />}
          value={sort}
          onChange={setSort}
          options={sortOptions}
        />
      </div>
    </Card>
  );
}

// Helper component for the segmented control buttons
interface FilterButtonProps {
  label: string;
  value: TaskFilter;
  currentValue: TaskFilter;
  onClick: (value: TaskFilter) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  value,
  currentValue,
  onClick,
}) => {
  const isSelected = value === currentValue;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex-1 py-2.5 text-sm font-medium transition duration-150 ${
        isSelected
          ? 'bg-purple-500 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-purple-50'
      }`}
    >
      {label}
    </button>
  );
};