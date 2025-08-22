// src/layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";
import { Topbar } from "../components/Topbar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left */}
      <AdminSidebar />

      {/* Main content on the right */}
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

export default AdminLayout;
