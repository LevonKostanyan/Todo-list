import React, {useEffect, useRef, useState} from "react";
import "./App.css";

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("all");
    const isRenderedRef = useRef(false)

    const tasksPerPage = 5;

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks"));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    useEffect(() => {
        if (isRenderedRef.current) {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        isRenderedRef.current = true;
    }, [tasks]);

    const addTask = () => {
        if (newTask.trim()) {
            setTasks([...tasks, {text: newTask, completed: false}]);
            setNewTask("");
        }
    };

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "uncompleted") return !task.completed;
        return true;
    });

    const toggleCompletion = (index) => {
        setTasks(
            tasks.map((task, i) =>
                i === index ? {...task, completed: !task.completed} : task
            )
        );
    };

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const startIndex = (currentPage - 1) * tasksPerPage;
    const currentTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

    return (
        <div className="app-container">
            <h1>To-Do List</h1>
            <div className="input-section">
                <input
                    className="task-input"
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task"
                />
                <button className="add-button" onClick={addTask}>
                    Add
                </button>
            </div>
            <div className="filter-section">
                <button onClick={() => setFilter("all")}>All</button>
                <button onClick={() => setFilter("completed")}>Completed</button>
                <button onClick={() => setFilter("uncompleted")}>Uncompleted</button>
            </div>

            <div className="task-list-container">
                <ul className="task-list">
                    {currentTasks.map((task, index) => (
                        <li
                            className={`task-item ${task.completed ? "completed" : "uncompleted"}`}
                            key={startIndex + index}
                        >
              <span className={`task-text ${task.completed ? "completed-text" : ""}`}>
                {task.text}
              </span>
                            <div className="task-actions">
                                <input
                                    className="task-checkbox"
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleCompletion(startIndex + index)}
                                />
                                <button
                                    className="remove-button"
                                    onClick={() => removeTask(startIndex + index)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pagination">
                <button
                    className="pagination-button prev-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Previous
                </button>
                <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
                <button
                    className="pagination-button next-button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default App;
