import React from "react";

function TaskCard({
  title,
  setTitle,
  description,
  setDescription,
  stateDescription,
  setStateDescription,
  onSubmit,
  editingTask,
  onCancel,
}) {
  return (
    <div
      className="card shadow border-0 position-sticky"
      style={{ top: "20px" }}
    >
      <div
        className={`card-header text-white fw-bold ${editingTask ? "bg-warning text-dark" : "bg-primary"}`}
      >
        <h5 className="card-title mb-0">
          {editingTask ? "✏️ Edit Selected Task" : "➕ Create New Task"}
        </h5>
      </div>
      <div className="card-body p-4">
        <div
          className="alert alert-info py-2 px-3 mb-3 border-0"
          style={{ fontSize: "0.85rem" }}
        >
          All fields are <strong>required</strong> except for the description,
          which is optional.
        </div>

        <form onSubmit={onSubmit}>
          {/* Task Title */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Task Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted">
              Description{" "}
              <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Provide additional details or leave blank..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Status Selection */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Status <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={stateDescription}
              onChange={(e) => setStateDescription(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button
              type="submit"
              className={`btn flex-grow-1 text-white fw-bold btn-${editingTask ? "warning text-dark" : "primary"}`}
            >
              {editingTask ? "Update Changes" : "Save Task"}
            </button>
            {editingTask && (
              <button
                type="button"
                className="btn btn-light border"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskCard;
