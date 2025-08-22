import { Card } from "../components/Card";
import  {EmployeeSidebar}  from "../components/EmployeeSidebar";
import { Topbar } from "../components/Topbar";
import { Clock, Briefcase, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export const EmployeeDashboard = () => {
  const cardData = [
    { title: "My Projects", value: 2, color: "bg-blue-500", icon: <Briefcase /> },
    { title: "My Timesheets", value: 1, color: "bg-green-500", icon: <FileText /> },
    { title: "My Attendance", value: "On Time", color: "bg-yellow-500", icon: <Clock /> },
    { title: "Leaves Balance", value: 5, color: "bg-indigo-500", icon: <Calendar /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <div className="flex-1 flex flex-col">
        <Topbar role="Employee" />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardData.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card {...card} />
              </motion.div>
            ))}
          </div>

          {/* Timesheet Form */}
          <motion.div
            className="mt-10 bg-white shadow-md rounded-lg p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="font-semibold text-lg mb-4">Weekly Timesheet</h2>
            <form className="space-y-4">
              <input
                className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Task description"
              />
              <input
                type="number"
                className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Hours worked"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
};
