import React, { useState } from 'react';
import { Task, Project } from '../types';
import { Calendar, Flag, Edit3, Trash2, CheckCircle2, Circle, Sparkles, Star, Zap } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  project: Project;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  project,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const isOverdue = task.dueDate && !task.completed && task.dueDate < new Date();
  const isDueSoon = task.dueDate && !task.completed && 
    task.dueDate > new Date() && 
    task.dueDate <= new Date(Date.now() + 24 * 60 * 60 * 1000);

  const priorityColors = {
    low: 'border-l-green-400',
    medium: 'border-l-yellow-400',
    high: 'border-l-red-400',
  };

  const priorityBadges = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const handleToggle = () => {
    if (!task.completed) {
      setIsCompleting(true);
      setShowCelebration(true);
      setTimeout(() => {
        onToggle(task.id);
        setIsCompleting(false);
        setTimeout(() => setShowCelebration(false), 2000);
      }, 600);
    } else {
      onToggle(task.id);
    }
  };
  return (
    <div
      className={`
        relative bg-white rounded-2xl shadow-xl border-l-4 ${priorityColors[task.priority]} 
        hover:shadow-3xl transition-all duration-700 ease-out
        transform hover:-translate-y-3 hover:scale-[1.03] hover:rotate-1
        ${task.completed ? 'opacity-80 bg-gradient-to-r from-green-50 to-emerald-50' : ''} 
        ${isOverdue ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300 animate-pulse' : ''}
        ${isDueSoon ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-300 animate-bounce' : ''}
        ${isCompleting ? 'animate-pulse scale-110 rotate-3' : ''}
        group overflow-hidden
        backdrop-blur-sm border border-white/20
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Multiple shimmer effects */}
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent
        transform -skew-x-12 transition-transform duration-1500
        ${isHovered ? 'translate-x-full opacity-30' : '-translate-x-full opacity-0'}
      `} />
      
      <div className={`
        absolute inset-0 bg-gradient-to-r from-transparent via-purple-200 to-transparent
        transform -skew-x-12 transition-transform duration-2000 delay-200
        ${isHovered ? 'translate-x-full opacity-20' : '-translate-x-full opacity-0'}
      `} />
      
      {/* Completion celebration effect */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <Sparkles className="text-yellow-400 animate-spin absolute" size={32} />
            <Star className="text-yellow-300 animate-ping absolute top-2 left-2" size={16} />
            <Zap className="text-orange-400 animate-bounce absolute -top-2 -right-2" size={20} />
          </div>
        </div>
      )}

      {/* Floating particles on hover */}
      {isHovered && (
        <>
          <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60" />
          <div className="absolute top-4 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" />
          <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce opacity-50" />
        </>
      )}

      <div className="p-6 relative z-10">
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggle}
            className={`
              mt-1 transition-all duration-500 hover:scale-150 hover:rotate-12
              ${isCompleting ? 'animate-bounce scale-125' : ''}
              relative group
            `}
          >
            {/* Enhanced glow effect for checkbox */}
            <div className={`
              absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-lg opacity-0
              transition-all duration-500
              ${task.completed ? 'opacity-60 scale-150' : 'group-hover:opacity-40 group-hover:scale-125'}
            `} />
            
            {task.completed ? (
              <CheckCircle2 
                size={24} 
                className="text-green-600 relative z-10 drop-shadow-2xl animate-pulse" 
              />
            ) : (
              <Circle 
                size={24} 
                className="text-gray-400 hover:text-green-600 transition-all duration-500 relative z-10 hover:drop-shadow-lg" 
              />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`
                font-bold text-lg text-gray-900 transition-all duration-500
                ${task.completed ? 'line-through text-gray-500' : 'group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text'}
              `}>
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full shadow-xl ring-2 ring-white animate-pulse"
                  style={{ backgroundColor: project.color }}
                />
                <span className={`
                  px-4 py-2 rounded-full text-xs font-bold shadow-lg
                  transform transition-all duration-300 hover:scale-125 hover:rotate-3
                  ${priorityBadges[task.priority]}
                  backdrop-blur-sm border border-white/30
                `}>
                  {task.priority}
                </span>
              </div>
            </div>

            {task.description && (
              <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-110">
                  <Flag size={14} className="animate-pulse" />
                  {project.name}
                </span>
                {task.dueDate && (
                  <span className={`flex items-center gap-2 font-medium ${
                    isOverdue ? 'text-red-600 font-bold animate-pulse' : 
                    isDueSoon ? 'text-orange-600 font-bold animate-bounce' : 'text-gray-500'
                  } transition-all duration-300 hover:scale-110`}>
                    <Calendar size={14} className={isOverdue ? 'animate-spin' : isDueSoon ? 'animate-bounce' : ''} />
                    {formatDate(task.dueDate)}
                    {isOverdue && ' (Overdue)'}
                    {isDueSoon && ' (Due Soon)'}
                  </span>
                )}
              </div>

              <div className={`flex gap-3 transition-all duration-500 ${
                isHovered ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-75'
              }`}>
                <button
                  onClick={() => onEdit(task)}
                  className={`
                    p-3 text-gray-400 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100
                    rounded-xl transition-all duration-300 transform hover:scale-125 hover:rotate-12
                    hover:shadow-xl backdrop-blur-sm border border-transparent hover:border-blue-200
                  `}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className={`
                    p-3 text-gray-400 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100
                    rounded-xl transition-all duration-300 transform hover:scale-125 hover:rotate-12
                    hover:shadow-xl backdrop-blur-sm border border-transparent hover:border-red-200
                  `}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom glow effect */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r 
        from-blue-500 via-purple-500 to-pink-500 opacity-0 blur-sm
        transition-all duration-500
        ${isHovered ? 'opacity-80 h-3' : 'opacity-0 h-1'}
      `} />
      
      {/* Corner sparkles */}
      <div className={`
        absolute top-2 left-2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full
        transition-all duration-700 ${isHovered ? 'opacity-60 scale-150 animate-ping' : 'opacity-0 scale-0'}
      `} />
      
      <div className={`
        absolute bottom-2 right-2 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full
        transition-all duration-700 delay-100 ${isHovered ? 'opacity-60 scale-150 animate-pulse' : 'opacity-0 scale-0'}
      `} />
    </div>
  );
};