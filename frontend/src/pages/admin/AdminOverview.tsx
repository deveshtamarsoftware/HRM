import { useState, FC } from "react";
import {
    Users,
    ClipboardList,
    Clock,
    DollarSign,
    UserPlus,
    PlusCircle,
    CheckSquare,
    FileText,
    Settings,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    BadgeAlert,
    Cake,
    Briefcase,
    X, // Added missing import
} from "lucide-react";

// --- Mock Data ---
interface StatCardProps {
    title: string;
    value: string;
    icon: FC<any>;
    color: string;
}

const kpiStats = [
    { title: "Total Employees", value: "1,250", icon: Users, color: "text-blue-500" },
    { title: "Departments", value: "15", icon: Briefcase, color: "text-purple-500" },
    { title: "Pending Leave", value: "12", icon: ClipboardList, color: "text-yellow-500" },
    { title: "Attendance Today", value: "1,100 / 1,250", icon: Clock, color: "text-green-500" },
];

const quickActions = [
    { title: "Add Employee", icon: PlusCircle, color: "bg-blue-600" },
    { title: "Approve Leave", icon: CheckSquare, color: "bg-green-600" },
    { title: "Generate Report", icon: FileText, color: "bg-purple-600" },
    { title: "Go to Settings", icon: Settings, color: "bg-gray-600" },
];

const recentJoiners = [
    { name: "Emily Johnson", joinDate: "Aug 15, 2024" },
    { name: "David Williams", joinDate: "Aug 12, 2024" },
    { name: "Olivia Brown", joinDate: "Aug 10, 2024" },
];

const employeesOnLeave = [
    { name: "Alex Miller", reason: "Vacation", dates: "Aug 19 - Aug 23" },
    { name: "Sophia Garcia", reason: "Sick Leave", dates: "Aug 19" },
];

const upcomingBirthdays = [
    { name: "John Smith", date: "Aug 22" },
    { name: "Mia Davis", date: "Aug 25" },
];

// --- Component Definition ---
const AdminOverview: FC = () => {
    return (
        <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Admin Dashboard</h1>
                <p className="text-base sm:text-lg text-gray-500 mt-1">Overview of company statistics and insights.</p>
            </header>

            {/* Top KPIs / Stats Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {kpiStats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 flex items-center transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl"
                    >
                        <div className={`p-3 rounded-full bg-gray-100 mr-4 ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Quick Actions */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl text-white font-semibold shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl ${action.color}`}
                        >
                            <action.icon size={28} className="mb-2" />
                            <span className="text-sm">{action.title}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Employee Overview & Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Employee Overview Card */}
                <section className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Overview</h2>
                    
                    {/* New Joiners */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2"><ArrowUpRight size={20} className="text-green-500" /> Recent New Hires</h3>
                        <ul className="space-y-2">
                            {recentJoiners.map((employee, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-800 font-medium">{employee.name}</span>
                                    <span className="text-sm text-gray-500">{employee.joinDate}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Employees on Leave */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2"><Briefcase size={20} className="text-yellow-500" /> Employees on Leave Today</h3>
                        <ul className="space-y-2">
                            {employeesOnLeave.map((employee, index) => (
                                <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-medium">{employee.name}</span>
                                        <span className="text-xs font-medium text-gray-600 px-2 py-1 rounded-full bg-yellow-200">{employee.reason}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Dates: {employee.dates}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Upcoming Birthdays */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2"><Cake size={20} className="text-pink-500" /> Upcoming Birthdays</h3>
                        <ul className="space-y-2">
                            {upcomingBirthdays.map((employee, index) => (
                                <li key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-medium">{employee.name}</span>
                                        <span className="text-sm text-gray-500">{employee.date}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Attendance & Leave Summary Card */}
                <section className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendance & Leave</h2>
                    
                    {/* Attendance Chart (simplified) */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Today's Attendance</h3>
                        <div className="w-full h-4 rounded-full overflow-hidden flex mb-2">
                            {/* Example of a visual bar representation */}
                            <div className="bg-green-500 h-full" style={{ width: '88%' }} title="88% Present"></div>
                            <div className="bg-red-500 h-full" style={{ width: '8%' }} title="8% Absent"></div>
                            <div className="bg-yellow-500 h-full" style={{ width: '4%' }} title="4% Late"></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Present</span>
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Absent</span>
                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span> Late</span>
                        </div>
                    </div>
                    
                    {/* Leave Requests */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2"><BadgeAlert size={20} className="text-red-500" /> Urgent Leave Requests</h3>
                        <p className="text-sm text-gray-500 mb-2">Approve or reject directly.</p>
                        <ul className="space-y-2">
                            {employeesOnLeave.map((leave, index) => (
                                <li key={index} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{leave.name}</p>
                                        <p className="text-sm text-gray-500">{leave.reason} ({leave.dates})</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"><CheckSquare size={16} /></button>
                                        <button className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"><X size={16} /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AdminOverview;
