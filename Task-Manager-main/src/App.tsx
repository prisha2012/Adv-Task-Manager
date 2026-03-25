import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import AuthForm from "./components/AuthForm";
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { ProjectSidebar } from './components/ProjectSidebar';
import { TaskStats } from './components/TaskStats';
import { FilterBar } from './components/FilterBar';
import { ParticleBackground } from './components/ParticleBackground';
import { FloatingActionButton } from './components/FloatingActionButton';
import { Task } from './types';
import { ListTodo, Sparkles } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<{ uid: string; email: string; }[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const {
    tasks,
    projects,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm,
    selectedProject,
    setSelectedProject,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    stats,
    isAdmin,
    userId,
    targetUserId,
    setTargetUserId,
  } = useTasks();

  // Fetch all users for admin dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      if (isAdmin) {
        const usersSnap = await getDocs(collection(db, 'users'));
        const users = usersSnap.docs.map(doc => ({
          uid: doc.id,
          email: doc.data().email || doc.id,
        }));
        setAllUsers(users);
      }
    };
    fetchUsers();
  }, [isAdmin]);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      <ParticleBackground />
      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
        />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          {/* Admin user selection UI */}
          {isAdmin && (
            <div className="p-4 bg-white shadow flex items-center gap-4">
              <span className="font-semibold">Assigning tasks as admin. Select user:</span>
              <select
                value={targetUserId || ''}
                onChange={e => setTargetUserId(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">-- Select User --</option>
                {allUsers.map(u => (
                  <option key={u.uid} value={u.uid}>{u.email}</option>
                ))}
              </select>
              {targetUserId && (
                <span className="text-sm text-gray-600">Selected: {allUsers.find(u => u.uid === targetUserId)?.email}</span>
              )}
            </div>
          )}
          {/* Header */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => signOut(auth)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h1>
          </div>
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">
            <div className="max-w-4xl mx-auto">
              {/* Stats */}
              <TaskStats stats={stats} />
              {/* Filter Bar */}
              <FilterBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filter={filter}
                onFilterChange={setFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onAddTask={() => setIsTaskFormOpen(true)}
              />
              {/* Task List */}
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-3xl transform hover:scale-125 hover:rotate-12 transition-all duration-500 relative overflow-hidden group">
                      {/* Empty state glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-md" />
                      <ListTodo size={32} className="text-gray-400 relative z-10 sm:w-12 sm:h-12" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      No tasks found
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm sm:text-lg font-medium">
                      {searchTerm || filter !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first task!'
                      }
                    </p>
                    {!searchTerm && filter === 'all' && (
                      <button
                        onClick={() => setIsTaskFormOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-500 transform hover:scale-110 hover:rotate-1 shadow-3xl font-bold text-sm sm:text-lg relative overflow-hidden group"
                      >
                        {/* Button glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-60 transition-opacity duration-300 blur-md" />
                        <span className="relative z-10">
                        Create Your First Task
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="animate-slideUp transform hover:scale-[1.02] transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TaskItem
                        task={task}
                        project={projects.find(p => p.id === task.projectId)!}
                        onToggle={toggleTask}
                        onEdit={handleEditTask}
                        onDelete={deleteTask}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Floating Action Button */}
      <div className="block sm:hidden">
        <FloatingActionButton 
        onClick={() => setIsTaskFormOpen(true)}
        isOpen={isTaskFormOpen}
      />
      </div>
      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTask}
        projects={projects}
        editingTask={editingTask}
      />
    </div>
  );
};

export default App;