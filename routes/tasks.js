import express from 'express';
import { getTasks, createTask,  updateTask, deleteTask } from '../controller/taskController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all tasks
router.get('/tasks', authenticateToken, getTasks);

// Route to create a new task
router.post('/tasks', authenticateToken, createTask);

// Route to update a task by taskId
router.put('/tasks/:taskId', authenticateToken, updateTask);

// Route to delete a task by taskId
router.delete('/tasks/:taskId', authenticateToken, deleteTask);

export default router;
