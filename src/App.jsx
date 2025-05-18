import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("Mid");
  const [editIdx, setEditIdx] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [editDueDate, setEditDueDate] = useState(null);
  const [editDueTime, setEditDueTime] = useState("");
  const [editPriority, setEditPriority] = useState("Mid");
  const [toast, setToast] = useState({ show: false, task: null, idx: null });
  const [sortBy, setSortBy] = useState("dateAdded");

  const handleAddTask = () => {
    if (input.trim() !== "") {
      setTasks([
        ...tasks,
        {
          text: input,
          dueDate,
          dueTime,
          priority,
          done: false,
        },
      ]);
      setInput("");
      setDueDate(null);
      setDueTime("");
      setPriority("Mid");
    }
  };

  const handleDeleteTask = (idx) => {
    setToast({ show: true, task: tasks[idx], idx });
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleUndoDelete = () => {
    if (toast.task !== null && toast.idx !== null) {
      const newTasks = [...tasks];
      newTasks.splice(toast.idx, 0, toast.task);
      setTasks(newTasks);
      setToast({ show: false, task: null, idx: null });
    }
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(
        () => setToast({ show: false, task: null, idx: null }),
        4000
      );
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleEditTask = (idx) => {
    setEditIdx(idx);
    setEditInput(tasks[idx].text);
    setEditDueDate(tasks[idx].dueDate);
    setEditDueTime(tasks[idx].dueTime);
    setEditPriority(tasks[idx].priority);
  };

  const sortedTasks = [...tasks];
  if (sortBy === "dueDate") {
    sortedTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (sortBy === "priority") {
    const order = { High: 1, Mid: 2, Low: 3 };
    sortedTasks.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  const handleSaveEdit = (idx) => {
    const updatedTasks = [...tasks];
    updatedTasks[idx].text = editInput;
    updatedTasks[idx].dueDate = editDueDate;
    updatedTasks[idx].dueTime = editDueTime;
    updatedTasks[idx].priority = editPriority;
    setTasks(updatedTasks);
    setEditIdx(null);
  };

  const handleToggleDone = (idx) => {
    const updatedTasks = [...tasks];
    updatedTasks[idx].done = !updatedTasks[idx].done;
    setTasks(updatedTasks);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#e57373";
      case "Mid":
        return "#ffd54f";
      case "Low":
        return "#81c784";
      default:
        return "#ccc";
    }
  };

  return (
    <div>
      <h1>To Do List</h1>
      <div style={{ marginBottom: "1em" }}>
        <label>Sort by: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dateAdded">Date Added</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task"
      />
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        placeholderText="Due date"
        dateFormat="yyyy-MM-dd"
        style={{ marginLeft: "8px" }}
      />
      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        style={{ marginLeft: "8px" }}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={{ marginLeft: "8px" }}
      >
        <option value="High">High</option>
        <option value="Mid">Mid</option>
        <option value="Low">Low</option>
      </select>
      <button onClick={handleAddTask} style={{ marginLeft: "8px" }}>
        Add Task
      </button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sortedTasks.map((task, idx) => (
          <li key={idx} style={{ margin: "1em 0" }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleToggleDone(idx)}
            />
            {editIdx === idx ? (
              <>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  style={{ marginLeft: "8px" }}
                />
                <DatePicker
                  selected={editDueDate}
                  onChange={(date) => setEditDueDate(date)}
                  placeholderText="Due date"
                  dateFormat="yyyy-MM-dd"
                  style={{ marginLeft: "8px" }}
                />
                <input
                  type="time"
                  value={editDueTime}
                  onChange={(e) => setEditDueTime(e.target.value)}
                  style={{ marginLeft: "8px" }}
                />
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  style={{ marginLeft: "8px" }}
                >
                  <option value="High">High</option>
                  <option value="Mid">Mid</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  onClick={() => handleSaveEdit(idx)}
                  style={{ marginLeft: "8px" }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditIdx(null)}
                  style={{ marginLeft: "4px" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.done ? "line-through" : "none",
                    marginLeft: "8px",
                  }}
                >
                  {task.text}{" "}
                  {task.dueDate && (
                    <em style={{ color: "#888" }}>
                      (
                      {task.dueDate instanceof Date
                        ? task.dueDate.toLocaleDateString()
                        : new Date(task.dueDate).toLocaleDateString()}
                      {task.dueTime && ` ${task.dueTime}`})
                    </em>
                  )}
                  <span
                    style={{
                      background: getPriorityColor(task.priority),
                      color: "#222",
                      borderRadius: "8px",
                      padding: "2px 8px",
                      marginLeft: "8px",
                      fontWeight: "bold",
                      fontSize: "0.9em",
                    }}
                  >
                    {task.priority}
                  </span>
                </span>
                <button
                  onClick={() => handleEditTask(idx)}
                  style={{ marginLeft: "8px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(idx)}
                  style={{ marginLeft: "4px" }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      {toast.show && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#333",
            color: "#fff",
            padding: "1em 2em",
            borderRadius: "8px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "1em",
          }}
        >
          Task deleted.
          <button
            onClick={handleUndoDelete}
            style={{
              color: "#333",
              background: "#ffd54f",
              border: "none",
              borderRadius: "4px",
              padding: "0.3em 1em",
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
