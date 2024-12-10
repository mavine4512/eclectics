import express from 'express';
import {connectToDatabase} from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const salt = 10;
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email])
        if(rows.length > 0) {
            return res.status(409).json({message : "user already existed"})
        }
        const hashPassword = await bcrypt.hash(password, salt)
        await db.query("INSERT INTO user (username, email, password) VALUES (?, ?, ?)", 
            [username, email, hashPassword])
        
        return res.status(201).json({message: "user created successfully"})
    } catch(err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email])
        if(rows.length === 0) {
            return res.status(404).json({message : "user does not existed"})
        }
        const isMatch = await bcrypt.compare(password, rows[0].password)
        if(!isMatch){
            return res.status(401).json({message : "Wrong password"})
        }

        const token = jwt.sign({id: rows[0].id}, process.env.JWT_KEY, {expiresIn: '3h'})
        
        return res.status(201).json({token: token})
    } catch(err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Token not provided' });
    }
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userId = decoded.id;
      next();
  } catch (err) {
    console.error('Error in verifyToken middleware:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

router.get('/home', verifyToken, async (req,res) => {
    try{
        const db = await connectToDatabase()
        const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [req.userId])
        if(rows.length === 0) {
            return res.status(404).json({message : "user not existed"})
        }
        return res.status(201).json({user:rows[0]})
    } catch(err){
        return res.status(500).json({message: 'Server Error'});
    }
})

// Create a new task
router.post('/tasks', verifyToken, async (req, res) => {
    const { subject, priority, description, dueDate } = req.body;

    if (!subject || !priority || !description || !dueDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = await connectToDatabase();
        const query = 'INSERT INTO task_list (subject, priority, description, dueDate, user_id) VALUES (?, ?, ?, ?, ?)';
        const values = [subject, priority, description, dueDate, req.userId];

        const [result] = await db.execute(query, values);

        res.status(201).json({ message: 'New task added', taskId: result.insertId });
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get tasks with pagination
router.get('/pagination', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = 10; // Number of tasks per page
  const offset = (page - 1) * limit; // Starting point for the current page

  try {
    const db = await connectToDatabase();

    // Query to fetch paginated tasks
    const [tasks] = await db.query(
      'SELECT * FROM task_list ORDER BY cdate DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Query to count total tasks
    const [countResult] = await db.query('SELECT COUNT(*) AS total FROM task_list');
    const totalTasks = countResult[0].total;
    const totalPages = Math.ceil(totalTasks / limit);

    res.json({
      tasks,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update a task
router.put('/tasks/:id', verifyToken, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { subject, priority, description, dueDate } = req.body;

  if (!subject || !priority || !description || !dueDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = await connectToDatabase();

    const [result] = await db.query(
      'UPDATE task_list SET subject = ?, priority = ?, description = ?, dueDate = ? WHERE id = ? AND user_id = ?',
      [subject, priority, description, dueDate, taskId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized to update' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a task
router.delete('/tasks/:id', verifyToken, async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    const db = await connectToDatabase();

    const [result] = await db.query(
      'DELETE FROM task_list WHERE id = ? AND user_id = ?',
      [taskId, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found or not authorized to delete' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;