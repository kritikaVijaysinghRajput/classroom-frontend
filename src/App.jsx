import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import { useSelector } from "react-redux";

const App = () => {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/auth/registration" element={<Registration />} />
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/"
          element={
            user ? (
              user.role === "principal" ? (
                <Navigate to="/principaldashboard" />
              ) : user.role === "teacher" ? (
                <Navigate to="/teacherdashboard" />
              ) : user.role === "student" ? (
                <Navigate to="/studentdashboard" />
              ) : (
                <Navigate to="/auth/login" />
              )
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/principaldashboard" element={<PrincipalDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
