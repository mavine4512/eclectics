import React, { useEffect, useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import Pagination from '../components/Pagination'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

   useEffect(()=>{
      fetchUser()
      fetchTasks()
   }, [currentPage])

   const fetchUser = async ()=>{
     try {
       const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/home', {
        headers:{
          "Authorization": `Bearer ${token}`
        }
      })
      if(response.status !== 201){
        navigate('/login');
      }
     } catch(error){
        navigate('/login');
        console.log('home Error',error) 
     }  
    }

    const fetchTasks = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/pagination?page=${currentPage}`)
          const data = await response.json()
          setTasks(data.tasks)
          setTotalPages(data.totalPages)
        } catch (error) {
          console.error('Error fetching tasks:', error)
        }
    }

  const handleCreateTask = async (newTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask),
      })
      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
        body: JSON.stringify(updatedTask),
      })
      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {'Authorization': `Bearer ${token}`
       },
        })
        if (response.ok) {
          fetchTasks()
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Management App</h1>
       <TaskForm onCreateTask={handleCreateTask} />
     <TaskList
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default Home