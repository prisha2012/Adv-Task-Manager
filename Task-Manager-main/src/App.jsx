import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://adv-task-manager.onrender.com/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    project: "General",
  });

  // 🔹 Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get(`${API}?userId=user123`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Add task
  const addTask = async () => {
    try {
      if (!form.title) {
        alert("Title is required");
        return;
      }

      const res = await axios.post(API, {
        title: form.title,
        userId: "user123",
        completed: false,
        project: form.project || "General",
        priority: form.priority,
        dueDate: form.dueDate,
      });

      setTasks((prev) => [...prev, res.data]);
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        project: "General",
      });
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert("Failed to create task");
    }
  };

  // 🔹 Delete task
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // 🔹 Toggle task
  const toggleTask = async (id, completed) => {
    const res = await axios.put(`${API}/${id}`, {
      completed: !completed,
    });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  // 🔹 Stats
  const completed = tasks.filter((t) => t.completed).length;

  // 🔹 Sorting (priority + deadline)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };

    if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
  });

  // 🔹 Style based on deadline
  const getTaskStyle = (task) => {
    if (!task.dueDate) return "";

    const today = new Date();
    const due = new Date(task.dueDate);
    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if (diff < 0) return "bg-red-100 border-l-4 border-red-500";
    if (diff < 1) return "bg-orange-100 border-l-4 border-orange-500";

    return "";
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-xl font-bold mb-4">📁 Projects</h2>
        <div className="bg-blue-100 p-3 rounded-lg flex justify-between">
          <span>All Tasks</span>
          <span>{tasks.length}</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome!</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            Total <br />
            <b>{tasks.length}</b>
          </div>
          <div className="bg-green-100 p-4 rounded-xl shadow">
            Completed <br />
            <b>{completed}</b>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl shadow">
            Pending <br />
            <b>{tasks.length - completed}</b>
          </div>
          <div className="bg-red-100 p-4 rounded-xl shadow">
            Overdue <br />
            <b>
              {
                tasks.filter(
                  (t) =>
                    !t.completed &&
                    t.dueDate &&
                    new Date(t.dueDate) < new Date()
                ).length
              }
            </b>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between mb-6">
          <input
            className="p-3 border rounded-lg w-1/2"
            placeholder="Search tasks..."
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 rounded-lg"
          >
            + Add Task
          </button>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl shadow p-4">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              No tasks found
            </div>
          ) : (
            sortedTasks.map((t) => (
              <div
                key={t._id}
                className={`flex justify-between items-center border-b py-3 px-2 rounded ${getTaskStyle(
                  t
                )}`}
              >
                <div>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t._id, t.completed)}
                    className="mr-2"
                  />
                  {t.title}

                  {/* Priority Badge */}
                  <span
                    className={`ml-2 text-xs px-2 py-1 rounded ${
                      t.priority === "high"
                        ? "bg-red-200 text-red-800"
                        : t.priority === "medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>

                <button
                  className="text-red-500"
                  onClick={() => deleteTask(t._id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>

            <input
              className="border p-2 w-full mb-3"
              placeholder="Task Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              className="border p-2 w-full mb-3"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              className="border p-2 w-full mb-3"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              className="border p-2 w-full mb-3"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}