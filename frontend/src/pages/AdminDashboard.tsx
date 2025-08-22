
import { Card } from "../components/Card";
import { AdminSidebar } from "../components/AdminSidebar";
import { Topbar } from "../components/Topbar";
import { Users, Briefcase, FileText, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const AdminDashboard = () => {
  const cardData = [
    { title: "Employees", value: 20, color: "bg-yellow-500", icon: <Users /> },
    { title: "Projects", value: 5, color: "bg-blue-500", icon: <Briefcase /> },
    {
      title: "Timesheets",
      value: 12,
      color: "bg-green-500",
      icon: <FileText />,
    },
    { title: "Messages", value: 4, color: "bg-indigo-500", icon: <Mail /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <Topbar role="Admin" />

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

          {/* Pending Timesheets Table */}
          <motion.div
            className="mt-10 bg-white shadow-md rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            
          </motion.div>
        </main>
      </div>
    </div>
  );
};
