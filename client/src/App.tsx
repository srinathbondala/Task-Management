// import { Box} from '@mui/material'
// import { BrowserRouter , Route, Routes  } from 'react-router-dom' 
// import Maindiv from './maindiv/Maindiv'
// import { TaskProvider } from './hooks/TaskContext'
// import LandingPage from './Home/LangingPage'
// import About from './pages/about/About'
// import Contact from './pages/contact/contact'
// import Header from "./Home/header";
// import './App.css'

// function App() {

//   const hideHeader = location.pathname.startsWith('/user');

//   return (
//     <TaskProvider>
//       <BrowserRouter>
//       {!hideHeader && <Header />}
//         <Box sx={{display:"flex"}}>
//           <Routes>
//             <Route path='/' element={<LandingPage />} />
//             <Route path="/about" element={<About />} />
//             <Route path='/contact' element={<Contact />} />
//             <Route path='/user/*' element={<Maindiv />} />
//             <Route path='*' element={<h1>Not Found</h1>} />
//           </Routes>
//         </Box>
//       </BrowserRouter>
//     </TaskProvider>
//   )
// }

// export default App
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Maindiv from './maindiv/Maindiv';
import LandingPage from './Home/LangingPage';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import MainLayout from './Home/MainLayout';
import Request from './pages/Request/Request';
import { Box } from '@mui/material';
import useToken from './hooks/useToken';
import { UserProfileProvider } from './hooks/userProfileContext';
import AdminPage from './adminMain/AdminPage';

function App() {
    const { checkToken, checkAdmin, checkUser  } = useToken();
    return (
      <UserProfileProvider>
        <BrowserRouter>
          <Box sx={{display:"flex"}}>
              <Routes>
                  <Route element={<MainLayout />}>
                      <Route path='/' element={<LandingPage />} />
                      <Route path="/about" element={<About />} />
                      <Route path='/contact' element={<Contact />} />
                      <Route path='/request' element={ <Request />} />
                  </Route>
                  {checkToken()  && checkUser() && (<Route path='/user/*' element={<Maindiv />} />)}
                  {checkToken() && checkAdmin() && (<Route path='/admin/*' element={<AdminPage />} />)}
                  <Route path='*' element={<h1>Not Found</h1>} />
              </Routes>
          </Box>
        </BrowserRouter>
      </UserProfileProvider>
    );
}

export default App;
