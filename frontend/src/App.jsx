import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard"; // <-- Using your custom TaskCard component name
import TaskTable from "./TaskTable";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stateDescription, setStateDescription] = useState("pending");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [idFilter, setIdFilter] = useState("");

  const API_URL = "http://localhost:8000/api/todos";

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the backend server.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditSelect = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setStateDescription(task.state?.description || "pending");
  };

  const resetForm = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setStateDescription("pending");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError("");
    const url = editingTask ? `${API_URL}/${editingTask.id}` : API_URL;
    const method = editingTask ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          state_description: stateDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to process task");

      await fetchTasks();
      resetForm();
    } catch (err) {
      setError(`Failed to ${editingTask ? "update" : "create"} task.`);
    }
  };

  const handleToggleStatus = async (task) => {
    const currentStatus = task.state?.description === "completed";
    const nextState = currentStatus ? "pending" : "completed";

    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state_description: nextState }),
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Erase this record completely?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchTasks();
        if (editingTask?.id === id) resetForm();
      }
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (!idFilter.trim()) return true;
    return task.id.toString().includes(idFilter.trim());
  });

  return (
    <div className="container-fluid my-5 px-4">
      <h1 className="text-center mb-5 fw-bold text-secondary">
        Task Operations Dashboard
      </h1>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      <div className="row g-4">
        {/* --- LEFT COLUMN: Form in a Card Component --- */}
        <div className="col-md-4">
          <TaskCard
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            stateDescription={stateDescription}
            setStateDescription={setStateDescription}
            onSubmit={handleSubmit}
            editingTask={editingTask}
            onCancel={resetForm}
          />
        </div>

        {/* --- RIGHT COLUMN: Task Table & Filter --- */}
        <div className="col-md-8">
          <div className="card shadow border-0 p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
              <h3 className="fw-bold text-dark mb-0">Stored Records</h3>

              <div className="input-group" style={{ maxWidth: "220px" }}>
                <span className="input-group-text bg-light text-muted">
                  🔍 ID
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Filter by ID..."
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                />
                {idFilter && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setIdFilter("")}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <TaskTable
              tasks={filteredTasks}
              onEditSelect={handleEditSelect}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
              activeEditingId={editingTask?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
