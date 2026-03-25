import React from 'react';
import { Project } from '../types';
import { FolderOpen, Plus } from 'lucide-react';

interface ProjectSidebarProps {
  projects: Project[];
  selectedProject: string;
  onSelectProject: (projectId: string) => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  selectedProject,
  onSelectProject,
}) => {
  return (
    <div className="w-16 sm:w-64 bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-lg shadow-3xl h-full relative overflow-hidden border-r border-gray-200/50">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full transform translate-x-16 -translate-y-16 opacity-50 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full transform -translate-x-12 translate-y-12 opacity-30 animate-float" />
      
      <div className="p-3 sm:p-6 border-b border-gray-200/50 relative z-10">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
            <FolderOpen size={20} className="text-white" />
          </div>
          <span className="hidden sm:block transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
            Projects
          </span>
        </h2>
      </div>

      <div className="p-2 sm:p-4 space-y-3 relative z-10">
        <button
          onClick={() => onSelectProject('all')}
          className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-lg ${
            selectedProject === 'all'
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-2 border-blue-200 shadow-xl backdrop-blur-sm'
              : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:shadow-lg'
          }`}
        >
          <span className="flex items-center gap-3 min-w-0">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg ring-2 ring-white animate-pulse flex-shrink-0" />
            <span className="font-semibold hidden sm:block truncate">All Tasks</span>
          </span>
          <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full hidden sm:block shadow-md">
            {projects.reduce((sum, p) => sum + p.taskCount, 0)}
          </span>
        </button>

        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between group transform hover:scale-105 hover:shadow-lg ${
              selectedProject === project.id
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-2 border-blue-200 shadow-xl backdrop-blur-sm'
                : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:shadow-lg'
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <div
                className="w-4 h-4 rounded-full shadow-lg ring-2 ring-white animate-pulse flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <span className="font-semibold hidden sm:block truncate">{project.name}</span>
            </span>
            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full hidden sm:block shadow-md">
              {project.taskCount}
            </span>
          </button>
        ))}

        <button className="w-full text-left p-4 rounded-xl text-gray-500 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 flex items-center gap-3 border-2 border-dashed border-gray-300 hover:border-gray-400 transform hover:scale-105 group hover:shadow-lg">
          <div className="p-1 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90 flex-shrink-0">
            <Plus size={14} />
          </div>
          <span className="font-semibold hidden sm:block">Add Project</span>
        </button>
      </div>
      
      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 right-2 w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-ping" />
      <div className="absolute top-1/2 right-4 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-3/4 right-3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-25 animate-bounce" />
    </div>
  );
};