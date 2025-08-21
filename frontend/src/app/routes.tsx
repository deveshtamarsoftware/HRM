import { Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import Splash from "../features/auth/pages/Splash";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import EmployeeLayout from "../layouts/EmployeeLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// Admin Pages
import AdminOverview from "../pages/admin/AdminOverview";
import Employees from "../pages/admin/Employees";
import Projects from "../pages/admin/Projects";
import Timesheets from "../pages/admin/Timesheets";
import { Announcements as AdminAnnouncements } from "../pages/admin/Announcements";
import Settings from "../pages/admin/Settings";
import AdminLeaves from "../pages/admin/Leaves";        
import AdminAttendance from "../pages/admin/Attendance"; 
import AdminHolidays from "../pages/admin/Holidays";    
import AdminDocuments from "../pages/admin/Documents";   

// Employee Pages
import EmployeeOverview from "../pages/employee/EmployeeOverview";
import MyProfile from "../pages/employee/MyProfile";
import MyProjects from "../pages/employee/MyProjects";
import MyTimesheets from "../pages/employee/MyTimesheets";
import MyAttendance from "../pages/employee/MyAttendance";
import MyLeaves from "../pages/employee/MyLeaves";
import { Announcements as EmployeeAnnouncements } from "../pages/employee/Announcements";

export const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Employee Dashboard */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute role="EMPLOYEE">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeOverview />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="projects" element={<MyProjects />} />
        <Route path="timesheets" element={<MyTimesheets />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="leaves" element={<MyLeaves />} />
        <Route path="announcements" element={<EmployeeAnnouncements />} />
      </Route>

      {/* Manager Dashboard */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute role="MANAGER">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="employees" element={<Employees />} />
        <Route path="projects" element={<Projects />} />
        <Route path="timesheets" element={<Timesheets />} />
        <Route path="leaves" element={<AdminLeaves />} />         
        <Route path="attendance" element={<AdminAttendance />} /> 
        <Route path="holidays" element={<AdminHolidays />} />     
        <Route path="documents" element={<AdminDocuments />} />   
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* HR Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="HR">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="employees" element={<Employees />} />
        <Route path="projects" element={<Projects />} />
        <Route path="timesheets" element={<Timesheets />} />
        <Route path="leaves" element={<AdminLeaves />} />         
        <Route path="attendance" element={<AdminAttendance />} /> 
        <Route path="holidays" element={<AdminHolidays />} />     
        <Route path="documents" element={<AdminDocuments />} />   
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Default route: redirect by role */}
      <Route
        path="*"
        element={
          role === "EMPLOYEE" ? (
            <Navigate to="/employee" replace />
          ) : role === "MANAGER" ? (
            <Navigate to="/manager" replace />
          ) : role === "HR" ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
