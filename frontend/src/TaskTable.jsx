import React from "react";

function TaskTable({
  tasks,
  onEditSelect,
  onToggleStatus,
  onDelete,
  activeEditingId,
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-muted text-center py-5">
        No structural data found. Write a task on the left!
      </div>
    );
  }

  // Helper function to cleanly format dates
  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-black-50">N/A</span>;
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col" style={{ width: "6%" }}>
              ID
            </th>
            <th scope="col" style={{ width: "20%" }}>
              Title
            </th>
            <th scope="col" style={{ width: "24%" }}>
              Description
            </th>
            <th scope="col" style={{ width: "12%" }}>
              Status
            </th>
            <th scope="col" style={{ width: "13%" }}>
              Created
            </th>
            <th scope="col" style={{ width: "13%" }}>
              Updated
            </th>
            <th scope="col" style={{ width: "12%" }} className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isCompleted = task.state?.description === "completed";
            const isSelected = activeEditingId === task.id;

            return (
              <tr
                key={task.id}
                onClick={() => onEditSelect(task)}
                className={`cursor-pointer ${isSelected ? "table-warning border-warning" : ""}`}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <strong>#{task.id}</strong>
                </td>
                <td>
                  <span
                    className={
                      isCompleted
                        ? "text-decoration-line-through text-muted"
                        : "fw-semibold"
                    }
                  >
                    {task.title}
                  </span>
                </td>
                <td
                  className="text-truncate text-muted"
                  style={{ maxWidth: "200px" }}
                >
                  {task.description || (
                    <span className="text-black-50">None</span>
                  )}
                </td>
                <td>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(task);
                    }}
                    className={`badge px-2.5 py-1.5 ${isCompleted ? "bg-success-subtle text-success border border-success" : "bg-warning-subtle text-dark border border-warning"}`}
                    style={{ cursor: "pointer", fontSize: "0.8rem" }}
                    title="Click to toggle status shortcut"
                  >
                    {task.state?.description || "unknown"}
                  </span>
                </td>
                <td className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {formatDate(task.creationDate)}
                </td>
                <td className="text-muted" style={{ fontSize: "0.85rem" }}>
                  {formatDate(task.updateDate)}
                </td>
                <td className="text-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id);
                    }}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TaskTable;
