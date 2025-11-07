import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Tasks from './components/Tasks'
import './App.css'

function App() {

  return (
    <div className="content-wrapper">
      <Tasks />
    </div>
  )
}
 

export default App
