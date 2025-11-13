// FILE: src/components/tasks/TaskCard.tsx
'use client';

import Card from '@/components/ui/Card'; //
import Button from '@/components/ui/Button'; //
import {
  Edit,
  Trash2,
  Clock,
  Calendar,
  Zap,
} from 'lucide-react';
import {
  getTimeAgo, //
  // The following helpers are assumed to be implemented in '@/utils/helpers' based on the plan
  // getPriorityBadge,
  // getDeadlineCountdown,
} from '@/utils/helpers';

// Placeholder types for structure completeness - these should ideally be imported from src/types/task.ts
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: TaskPriority;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

// --- MOCK/ASSUMED HELPERS (These must be implemented in src/utils/helpers.ts) ---
// Note: In the final application, ensure these functions are correctly imported from '@/utils/helpers'
const getPriorityBadge = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return { text: 'High', color: 'bg-red-500 text-white' };
    case 'medium':
      return { text: 'Medium', color: 'bg-yellow-400 text-gray-800' };
    case 'low':
    default:
      return { text: 'Low', color: 'bg-blue-300 text-blue-900' };
  }
};

const getDeadlineCountdown = (deadline: string | null): string => {
  if (!deadline) return '';
  const now = new Date();
  const dead = new Date(deadline);
  const diffMs = dead.getTime() - now.getTime();

  if (diffMs < 0) return 'Expired';

  const diffDays = Math.ceil(diffMs / 86400000);

  if (diffDays === 0) return 'Due Today';
  if (diffDays === 1) return '1 Day Left';
  return `${diffDays} Days Left`;
};
// --------------------------------------------------------------------------------

export default function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const priorityInfo = getPriorityBadge(task.priority);
  const countdown = getDeadlineCountdown(task.deadline);

  const handleToggle = () => {
    onToggleComplete(task.id, !task.is_completed);
  };

  const isDueSoon = countdown && (countdown.includes('Due Today') || countdown.includes('Day Left'));
  const isExpired = countdown === 'Expired';

  return (
    <Card
      className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center transition-all duration-300 space-y-4 md:space-y-0 ${
        task.is_completed
          ? 'bg-green-50/50 border-green-200'
          : isExpired
          ? 'bg-red-50/50 border-red-300'
          : 'bg-white hover:shadow-lg'
      }`}
    >
      {/* Task Details */}
      <div className="flex items-start space-x-4 w-full md:w-8/12">
        {/* Toggle Checkbox */}
        <div className="pt-1">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={handleToggle}
            className={`
              w-6 h-6 rounded-md appearance-none border-2 transition-all cursor-pointer
              ${task.is_completed
                ? 'bg-purple-600 border-purple-600 checked:text-white'
                : 'border-gray-300 hover:border-purple-500'
              }
            `}
          />
        </div>

        {/* Title and Description */}
        <div>
          <h3
            className={`text-lg font-semibold ${
              task.is_completed ? 'line-through text-gray-400' : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Priority Badge */}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityInfo.color} flex items-center gap-1`}
            >
              <Zap className="w-3 h-3" />
              {priorityInfo.text}
            </span>

            {/* Deadline Countdown */}
            {task.deadline && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isExpired ? 'bg-red-600 text-white' : isDueSoon ? 'bg-orange-300 text-orange-900' : 'bg-purple-100 text-purple-600'
                }`}
              >
                <Clock className="w-3 h-3" />
                {countdown}
              </span>
            )}

            {/* Created At */}
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created {getTimeAgo(task.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex gap-2 md:ml-4 self-end md:self-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(task)}
          className="hover:bg-purple-50 p-2 border-purple-200"
          title="Edit Task"
        >
          <Edit className="w-4 h-4 text-purple-600" />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="p-2"
          title="Delete Task"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}