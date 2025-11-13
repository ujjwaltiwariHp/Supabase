'use client';

import React, { useState } from 'react';
import { useTasks, Task } from '@/lib/hooks/useTasks';
import TaskCard from './TaskCard';
import CreateTaskForm from './CreateTaskForm';
import TaskFilters from './TaskFilters';
import EditTaskModal from './EditTaskModal';
import Card from '@/components/ui/Card';
import { ListTodo, Loader2, AlertTriangle } from 'lucide-react';

export default function TaskList() {
  const {
    tasks,
    isLoading,
    error,
    handleToggleComplete,
    handleDeleteTask,
    filter,
  } = useTasks();

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };


  if (isLoading) {
    return (
      <Card className="p-8 text-center text-purple-600">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
        <p className="font-semibold">Loading your tasks...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 bg-red-50 border border-red-300 text-red-700">
        <AlertTriangle className="w-6 h-6 inline mr-2" />
        <p className="font-medium">Error fetching tasks: {error}</p>
      </Card>
    );
  }

  const isFilteredEmpty = tasks.length === 0 && filter !== 'all';
  const hasTasks = tasks.length > 0;

  return (
    <div className="space-y-8">
      <CreateTaskForm />
      <TaskFilters />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-purple-500" />
          {filter === 'all' ? 'All Tasks' : filter === 'pending' ? 'Pending Tasks' : 'Completed Tasks'} ({tasks.length})
        </h2>

        {/* Task List */}
        {hasTasks ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-purple-50 border-purple-200">
            <p className="text-lg font-semibold text-purple-700">
              {isFilteredEmpty
                ? 'No tasks match your current filter settings.'
                : 'You have no tasks yet! Start by creating one above.'
              }
            </p>
          </Card>
        )}
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        task={taskToEdit}
        onClose={handleCloseEditModal}
      />
    </div>
  );
}