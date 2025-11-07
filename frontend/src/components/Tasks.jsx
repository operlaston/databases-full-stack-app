import axios from "axios"
import { useEffect, useState } from "react"
import Form from './Form'

const Tasks = () => {

  const [tasks, setTasks] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const baseUrl = 'http://localhost:3001/api/tasks';

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        console.error("couldn't retrieve data from the server")
      })
  }, [])

  const handleSubmit = (event, title, description, status) => {
    event.preventDefault()

    if (title === "" || description === "") {
      alert("please input at least a title and a description")
      return -1;
    }

    let statusMod = status;
    if (status === "") {
      statusMod = "Not Started";
    }

    const taskInfo = {
      title: title,
      description: description,
      status: statusMod
    }

    axios
      .post(baseUrl, taskInfo)
      .then(response => {
        setTasks(tasks.concat(response.data))
      })
      .catch(error => {
        console.error("task failed to be added")
      })
  }

  const deleteTask = (id) => {
    axios.delete(`${baseUrl}/${id}`)
      .then(res => {
        setTasks(tasks.filter(task => task.id !== id))
      })
      .catch(error => {
        console.error('an error occurred')
      })
  }

  const editTask = (id, newTask) => {
    axios.put(`${baseUrl}/${id}`, newTask)
      .then(res => {
        console.log(`successfully updated task ${id}`)
        axios.get(baseUrl)
          .then(res => {
            setTasks(res.data)
          })
          .catch(error => {
            console.error('error fetching data after update')
          })
      })
      .catch(error => {
        console.error('an error occurred')
      })
  }


  if (!tasks) {
    return (
      <>Loading tasks...</>
    )
  }

  let filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
  if (statusFilter !== '' ) {
    filteredTasks = tasks.filter(task => task.status === statusFilter);
  }

  return (
    <div className="content-card">
      <Form handleSubmit={handleSubmit}/>
      <div className="tasks">
        <h1 className="tasks-title">Tasks</h1>

        <input type="text" placeholder="Search by title" value={search} onChange={(event) => setSearch(event.target.value)}/>
        <div className="search-filter">
          Filter by status:
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option></option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {filteredTasks.map(task => {
          return (
            <Task id={task.id} title={task.title} description={task.description} status={task.status} editTask={editTask} deleteTask={deleteTask}/>
          )
        })}
      </div>
    </div>
  )
}

const Task = ({id, title, description, status, editTask, deleteTask}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newStatus, setNewStatus] = useState(status);

  const resetEdit = () => {
    setNewTitle(title);
    setNewDescription(description);
    setNewStatus(status);
    setIsEditing(false);
  }

  const submitEdits = () => {
    editTask(id, {title: newTitle, description: newDescription, status: newStatus});
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div key={id} className="task-edit-form">
        <div className="form-input">
          <label htmlFor="title">Title</label>
          <input className="task-title-edit" type="text" id="title" value={newTitle} onChange={(event)=>setNewTitle(event.target.value)} placeholder={title}/>
        </div>

        <div className="form-input">
          <label htmlFor="desc">Description</label>
          <textarea className="form-input-desc" type="text" id="desc" value={newDescription} placeholder={description} onChange={(event)=>setNewDescription(event.target.value)}/>
        </div>

        <div className="form-input">
          <label htmlFor="status">Status</label>
          <select id="status" value={newStatus} onChange={(event)=>setNewStatus(event.target.value)}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="task-actions">
          <button className="submit-task-edit-button" onClick={submitEdits}>Submit</button>
          <button className="cancel-task-edit-button" onClick={resetEdit}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div key={id} className="task">
      <h2 className="task-title">{title}</h2>
      <div>Description: {description}</div>
      <div>Status: {status}</div>
      <div className="task-actions">
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button className="delete-task-button" onClick={() => deleteTask(id)}>Delete</button>
      </div>
    </div>
  )

}

export default Tasks