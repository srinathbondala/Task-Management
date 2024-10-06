import { Box} from '@mui/material'
import { BrowserRouter , Route, Routes  } from 'react-router-dom' 
import Maindiv from './maindiv/Maindiv'
import { TaskProvider } from './hooks/TaskContext'
import './App.css'

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Box sx={{display:"flex"}}>
          <Routes>
            <Route path='/' element={<h1>Home</h1>} />
            <Route path='/user/*' element={<Maindiv />} />
            <Route path='*' element={<h1>Not Found</h1>} />
          </Routes>
        </Box>
      </BrowserRouter>
    </TaskProvider>
  )
}

export default App
