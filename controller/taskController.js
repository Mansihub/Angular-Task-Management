// import {pool} from '../db/db.js';
import { v4 as uuidv4 } from 'uuid';
import config from '../../api/db/config.js';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
const pool=mysql.createPool(config)



const createTask = async (req, res) => {
  try {
    const taskId = uuidv4(); 
    const { email } = req.user;
    const { taskName, taskDescription = '',status } = req.body;

    if (!taskName) {
       return res.status(400).json({ error: 'Task Name is required' });
     }

    await pool.query(
      'INSERT INTO tasks (taskId, taskName, taskDescription, status, email) VALUES (?, ?, ?, ?, ?)',
      [taskId, taskName, taskDescription, status, email]
    );

    res.json({ message: 'Task created successfully!', taskId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  const { taskName: newTaskName, taskDescription: newTaskDescription,status } = req.body; 
  const { email } = req.user;
  const { taskId } = req.params;

  try {
    const [existingTask] = await pool.query('SELECT * FROM tasks WHERE taskId = ? AND email = ?', [taskId, email]);

    if (existingTask.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Extracting the existing taskName and taskDescription from the fetched task
    const { taskName: existingTaskName, taskDescription: existingTaskDescription } = existingTask[0];

    const updatedTaskName = newTaskName !== undefined ? newTaskName : existingTaskName;
    const updatedTaskDescription = newTaskDescription !== undefined ? newTaskDescription : existingTaskDescription;

    const [result] = await pool.execute(
      'UPDATE tasks SET taskName = ?, taskDescription = ? ,status=? WHERE taskId = ? AND email = ?',
      [updatedTaskName, updatedTaskDescription,status, taskId, email]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ message: 'Task updated successfully!' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteTask = async (req, res) => {
  const { email } = req.user;
  const { taskId } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM tasks WHERE taskId = ? AND email = ?', [taskId, email]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ message: 'Task deleted successfully!' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTasks = async (req, res) => {
  const { email } = req.user;
  
  try {
    const sql3 = `SELECT * FROM tasks WHERE email = ?`;
    const [rows] = await pool.query(sql3, [email]);
    if (rows.length === 0) {
      res.json({ message: "No tasks to show" });
    } else {
      res.status(200).json({ tasks: rows });
      }
      console.log("Records retrieved:", rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export { getTasks, createTask, updateTask, deleteTask };
