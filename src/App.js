import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (!task || !date || !dueDate) return alert('All fields are required');
    const newTask = {
      id: uuidv4(),
      task,
      date,
      dueDate,
      status: 'Pending',
    };
    setTasks([...tasks, newTask]);
    closePopup();
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const markAsDone = (id) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, status: 'Done', doneDate: currentDate } : t
      )
    );
  };
  
  const undoTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: 'Pending', doneDate: undefined } : t))
    );
  };
  

  const toggleStatus = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'Pending' ? 'Hold' : 'Pending',
            }
          : t
      )
    );
  };

  const updateDueDate = (id, newDueDate) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, dueDate: newDueDate } : t))
    );
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTask('');
    setDate('');
    setDueDate('');
  };

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Calculate the index of the first and last tasks for the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  // Function to go to the next page
  const nextPage = () => {
    if (currentPage * tasksPerPage < tasks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    document.title = `Task Management ( ${tasks.length} )`;
  }, [tasks]);

  return (
    <div className="App">
      <h1 className="h1-task-to-do">Task To Do
      <button className="open-popup-btn" onClick={openPopup}>New Task</button></h1>

      <div className="task-table-container">
        {tasks.length === 0 ? (
          <p>No tasks available. Add a new task!</p>
        ) : (
          <>
             {/* Pagination Controls */}
             <div className="pagination-controls">
              <button className="previous-next-btn" onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {Math.ceil(tasks.length / tasksPerPage)}
              </span>
              <button className="previous-next-btn" onClick={nextPage} disabled={currentPage * tasksPerPage >= tasks.length}>
                Next
              </button>
            </div>
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((t) => (
                  <tr key={t.id} className={t.status === 'Done' ? 'completed-task' : ''}>
                    <td>{t.task}</td>
                    <td>{t.date}</td>
                    <td>
                      {t.status === 'Done' ? (
                        <span>{t.dueDate}</span>
                      ) : (
                        <input
                          type="date"
                          value={t.dueDate}
                          onChange={(e) => updateDueDate(t.id, e.target.value)}
                          disabled={t.status === 'Done'}
                        />
                      )}
                    </td>
                    <td>
                      {t.status === 'Pending' || t.status === 'Hold' ? (
                        <button onClick={() => toggleStatus(t.id)} className={`status-btn ${t.status.toLowerCase()}`}>
                          {t.status}
                        </button>
                      ) : (
                        <span className="status-done">
                          Done {t.doneDate && `on ${t.doneDate}`}
                        </span>
                      )}
                    </td>
                    <td>
                      {t.status === 'Done' ? (
                        <>
                          <button onClick={() => undoTask(t.id)}>Undo</button>
                          <button onClick={() => deleteTask(t.id)}>Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => markAsDone(t.id)}>Done</button>
                          <button onClick={() => deleteTask(t.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

         
          </>
        )}
      </div>


      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Add New Task</h2>
            <input
              type="text"
              placeholder="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button onClick={addTask}>Add Task</button>
            <button onClick={closePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
