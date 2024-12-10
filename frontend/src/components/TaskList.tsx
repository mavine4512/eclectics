import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export default function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  const [editingTask, setEditingTask] = useState(null)

  const handleEdit = (task) => {
    setEditingTask(task)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  const handleSaveEdit = () => {
    onUpdateTask(editingTask)
    setEditingTask(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditingTask((prevTask) => ({ ...prevTask, [name]: value }))
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="border p-4 rounded-md">
          {editingTask && editingTask.id === task.id ? (
            <div className="space-y-2">
              <Input
                type="text"
                name="subject"
                value={editingTask.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
              />
              <Select name="priority" value={editingTask.priority} onValueChange={(value) => setEditingTask((prevTask) => ({ ...prevTask, priority: value }))}>
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
                value={editingTask.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
              <Input
                type="date"
                name="dueDate"
                value={editingTask.dueDate}
                onChange={handleChange}
              />
              <div className="space-x-2">
                <Button className="w-30 mt-4 bg-green-300" onClick={handleSaveEdit}>Save</Button>
                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold">{task.subject}</h3>
              <p className="text-sm text-gray-600">Priority: {task.priority}</p>
              <p>{task.description}</p>
              {task.dueDate && (
                <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
              )}
              <div className="mt-2 space-x-2">
                <Button className="w-30 mt-4 bg-blue-200" onClick={() => handleEdit(task)}>Edit</Button>
                <Button  className="w-30 mt-4 bg-red-300" variant="destructive" onClick={() => onDeleteTask(task.id)}>Delete</Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

