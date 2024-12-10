import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export default function TaskForm({ onCreateTask }) {
  const [task, setTask] = useState({
    subject: '',
    priority: 'medium',
    description: '',
    dueDate: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setTask((prevTask) => ({ ...prevTask, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateTask(task)
    setTask({ subject: '', priority: 'medium', description: '', dueDate: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <Input
        type="text"
        name="subject"
        value={task.subject}
        onChange={handleChange}
        placeholder="Subject"
        required
      />
      <Select name="priority" value={task.priority} onValueChange={(value) => setTask((prevTask) => ({ ...prevTask, priority: value }))}>
        <SelectTrigger>
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <Input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
      />
      <Button className="w-30 mt-4 bg-blue-400 text-white"  type="submit">Create Task</Button>
    </form>
  )
}

