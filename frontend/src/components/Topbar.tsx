import { Bell } from "lucide-react";
import { LogOut } from "lucide-react";

export const Topbar = () => {
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("User logged out!");
  };

  return (
    <header className="fixed top-0 left-64 right-0 flex items-center justify-between bg-gradient-to-r from-white via-blue-50 to-white shadow-md px-6 md:px-8 py-4 rounded-b-xl border-b border-gray-200 z-50">
      {/* Left: Greeting */}
      <div className="text-center md:text-left">
        <h1 className="text-lg md:text-xl font-bold text-gray-800">
          Welcome back, John 👋
        </h1>
        <p className="text-sm text-gray-500">Dashboard Overview</p>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 self-center">
          <Bell className="h-6 w-6 text-gray-700" />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* Profile Section */}
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-sm hover:shadow-md transition duration-200 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
          />
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">John Doe</p>
            <p className="text-xs text-gray-500">Product Manager</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 self-center"
          title="Logout"
        >
          <LogOut className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};