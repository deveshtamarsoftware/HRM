// src/layouts/EmployeeLayout.tsx
import { Outlet } from "react-router-dom";
import { EmployeeSidebar } from "../components/EmployeeSidebar";
import { Topbar } from "../components/Topbar";

const EmployeeLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col">
        {/* Topbar always visible */}
        <Topbar />

        {/* Page content will render here */}
        <main className="p-6 flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
