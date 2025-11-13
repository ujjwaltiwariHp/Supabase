'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTasks, Task, TaskPriority } from '@/lib/hooks/useTasks';
import { Edit, Save, X, AlignLeft, Zap, Calendar } from 'lucide-react';

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

const formatDeadline = (isoString: string | null): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
};

const PrioritySelect = ({ value, onChange }: { value: TaskPriority, onChange: (value: TaskPriority) => void }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Priority
    </label>
    <div className="relative">
      <Zap className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 z-10" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TaskPriority)}
        className="w-full px-4 pl-10 py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white appearance-none transition"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  </div>
);

export default function EditTaskModal({ isOpen, task, onClose }: EditTaskModalProps) {
  const { handleUpdateTask } = useTasks();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'low');
  const [deadline, setDeadline] = useState(formatDeadline(task?.deadline || null));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDeadline(formatDeadline(task.deadline || null));
      setError('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsLoading(true);

    const deadlineIso = deadline ? new Date(deadline).toISOString() : null;

    const updates = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      deadline: deadlineIso,
    };

    try {
      const result = await handleUpdateTask(task.id, updates);

      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to update task.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transition-all transform scale-100"
      >
        <div className="p-6 border-b border-purple-100 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Edit className="w-6 h-6 text-purple-600" />
            Edit Task: {task.title}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition" aria-label="Close modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg" role="alert">
              {error}
            </div>
          )}

          <Input
            label="Task Title"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            icon={<Edit className="w-5 h-5" />}
          />

          <Input
            label="Description (Optional)"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            icon={<AlignLeft className="w-5 h-5" />}
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <PrioritySelect
              value={priority}
              onChange={setPriority}
            />
            <Input
              label="Deadline (Optional)"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}