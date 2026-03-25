import { useState, useEffect, useMemo } from 'react';
import { Task, Project, FilterType, SortType } from '../types';
import { db, auth } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { User } from 'firebase/auth';

const defaultProjects: Project[] = [
  { id: 'personal', name: 'Personal', color: '#3B82F6', taskCount: 0 },
  { id: 'work', name: 'Work', color: '#10B981', taskCount: 0 },
  { id: 'shopping', name: 'Shopping', color: '#F59E0B', taskCount: 0 },
  { id: 'health', name: 'Health', color: '#EF4444', taskCount: 0 },
];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<string | null>(null); // for admin

  // Detect current user and admin status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        setUserId(user.uid);
        // Check admin flag in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUserId(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Helper: which userId to use for data
  const effectiveUserId = isAdmin && targetUserId ? targetUserId : userId;

  // Load projects from Firestore
  useEffect(() => {
    if (!effectiveUserId) {
      setProjects([]);
      return;
    }
    const projectsRef = collection(db, 'users', effectiveUserId, 'projects');
    const unsub = onSnapshot(projectsRef, (snapshot) => {
      const projs: Project[] = [];
      snapshot.forEach(docSnap => {
        projs.push({ ...docSnap.data(), id: docSnap.id } as Project);
      });
      setProjects(projs.length ? projs : defaultProjects);
    });
    return () => unsub();
  }, [effectiveUserId]);

  // Load tasks from Firestore
  useEffect(() => {
    if (!effectiveUserId) {
      setTasks([]);
      return;
    }
    const tasksRef = collection(db, 'users', effectiveUserId, 'tasks');
    const unsub = onSnapshot(tasksRef, (snapshot) => {
      const t: Task[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        t.push({
          ...data,
          id: docSnap.id,
          dueDate: data.dueDate ? data.dueDate.toDate ? data.dueDate.toDate() : new Date(data.dueDate) : undefined,
          createdAt: data.createdAt ? data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt) : new Date(),
        });
      });
      setTasks(t);
    });
    return () => unsub();
  }, [effectiveUserId]);

  // Add a task
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!effectiveUserId) return;
    const tasksRef = collection(db, 'users', effectiveUserId, 'tasks');
    await addDoc(tasksRef, {
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  // Update a task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!effectiveUserId) return;
    const taskRef = doc(db, 'users', effectiveUserId, 'tasks', id);
    await updateDoc(taskRef, {
      ...updates,
      updatedAt: new Date(),
    });
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!effectiveUserId) return;
    const taskRef = doc(db, 'users', effectiveUserId, 'tasks', id);
    await deleteDoc(taskRef);
  };

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  };

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedProject !== 'all') {
      filtered = filtered.filter(task => task.projectId === selectedProject);
    }
    switch (filter) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'overdue':
        filtered = filtered.filter(task =>
          !task.completed &&
          task.dueDate &&
          task.dueDate < new Date()
        );
        break;
    }
    switch (sortBy) {
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      }
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'date':
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }
    return filtered;
  }, [tasks, filter, sortBy, searchTerm, selectedProject]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(t =>
      !t.completed &&
      t.dueDate &&
      t.dueDate < new Date()
    ).length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  return {
    tasks: filteredTasks,
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
  };
};