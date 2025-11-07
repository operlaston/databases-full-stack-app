import { useState, useEffect } from "react"


const Form = ({ handleSubmit }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  
  return(
    <div className="form-wrapper">
      <form className="form-content" onSubmit={(event) => {
        const returnedValue = handleSubmit(event, title, description, status)
        if (returnedValue === undefined) {
          setTitle('')
          setDescription('')
          setStatus('')
        }
      }}>
        <div className="form-input">
          <label htmlFor="title">Title</label>
          <input className="form-input-title" type="text" id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>

        <div className="form-input">
          <label htmlFor="desc">Description</label>
          <textarea className="form-input-desc" type="text" id="desc" value={description} onChange={(event)=>setDescription(event.target.value)}/>
        </div>

        <div className="form-input">
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(event)=>setStatus(event.target.value)}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <div className="submit-container"><button className="submit-button" type="submit">Create Task</button></div>
      </form>
    </div>
  )
}

export default Form