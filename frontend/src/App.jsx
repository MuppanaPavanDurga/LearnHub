import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppNavbar from "./components/Navbar";
import CreateCourse from "./pages/CreateCourse";
import BrowseCourses from "./pages/BrowseCourses";
import AddSection from "./pages/AddSection";
import MyCourses from "./pages/MyCourses";
import CoursePlayer from "./pages/CoursePlayer";
import AssignCourse from "./pages/AssignCourse";
import TeacherDashboard from "./pages/TeacherDashboard";
import Home from "./pages/Home"; 

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const hideNavbar = ["/login", "/register", "/"].includes(pathname); 
  return (
    <>
      {!hideNavbar && <AppNavbar />}
      {children}
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/"  element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/teacher-dashboard" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>} />
          <Route path="/browse"  element={<PrivateRoute><BrowseCourses /></PrivateRoute>} />
          <Route path="/create-course"  element={<PrivateRoute><CreateCourse /></PrivateRoute>} />
          <Route path="/add-section"  element={<PrivateRoute><AddSection /></PrivateRoute>} />
          <Route path="/my-courses" element={<PrivateRoute><MyCourses /></PrivateRoute>} />
          <Route path="/course/:id"  element={<PrivateRoute><CoursePlayer /></PrivateRoute>} />
          <Route path="/assign-course"  element={<PrivateRoute><AssignCourse /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}