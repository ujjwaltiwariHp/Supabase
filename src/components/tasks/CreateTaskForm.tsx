'use client';

import React, { useState } from 'react';
import { useTasks, TaskPriority } from '@/lib/hooks/useTasks';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ListPlus, AlignLeft, Zap, Calendar } from 'lucide-react';
import Card from '@/components/ui/Card';

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

export default function CreateTaskForm() {
  const { handleCreateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('low');
  const [deadline, setDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setIsLoading(true);
    try {
      const deadlineIso = deadline ? new Date(deadline).toISOString() : null;

      const result = await handleCreateTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        deadline: deadlineIso,
      });

      if (result.success) {
        // Reset form
        setTitle('');
        setDescription('');
        setPriority('low');
        setDeadline('');
      } else {
        setError(result.error || 'Failed to create task.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ListPlus className="w-6 h-6 text-purple-500" />
          Quick Add Task
        </h2>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-lg" role="alert">
            {error}
          </div>
        )}

        {/* Title Input */}
        <Input
          placeholder="Task title (e.g., Finish TaskFlow project)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<ListPlus className="w-5 h-5" />}
          autoFocus
        />

        {/* Description Input */}
        <Input
          placeholder="Optional description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          icon={<AlignLeft className="w-5 h-5" />}
        />

        {/* Priority and Deadline Row */}
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

        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          Add Task
        </Button>
      </form>
    </Card>
  );
}