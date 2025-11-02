import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../Home/MainLayout";
import { BrowserRouter } from "react-router-dom";
import LandingPage from "../Home/LangingPage";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import Request from "../pages/Request/Request";
import { Box } from "@mui/material";
import { roleType as UserRole } from "../Types/Task";
import Maindiv from "../maindiv/Maindiv";
import AdminPage from "../adminMain/AdminPage";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorize from "../pages/HelperPages/Unauthorize";

const AppRoutes:React.FC = () => {
    return (
        <BrowserRouter>
            <Box sx={{ display: "flex" }}>
                <Routes>
                    <Route element={<MainLayout />}>
                      <Route path='/' element={<LandingPage />} />
                      <Route path="/about" element={<About />} />
                      <Route path='/contact' element={<Contact />} />
                      <Route path='/request' element={ <Request />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={[UserRole.USER]} />}>
                    <Route path='/user/*' element={<Maindiv />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                      <Route path='/admin/*' element={<AdminPage />} />
                  </Route>
                  <Route path='/unauthorized' element={<Unauthorize />} />
                  <Route path='*' element={<h1>Not Found</h1>} />
              </Routes>
          </Box>
        </BrowserRouter> 
    );
}

export default AppRoutes;