import React, { useState } from "react";
import {
  User,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  ListTodo,
  Calendar,
  Bell,
  BarChart2,
  Gift,
  Star,
  Book,
  HandPlatter,
  Clipboard,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

// Interfaces for data structures
interface EmployeeProfile {
  name: string;
  photoUrl: string;
  designation: string;
  department: string;
  employeeId: string;
}

interface LeaveBalance {
  type: string;
  balance: number;
  total: number;
  color: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface Task {
  id: number;
  name: string;
  completed: boolean;
  deadline: string;
}

// Mock Data
const employeeProfile: EmployeeProfile = {
  name: "Jane Doe",
  photoUrl: "https://placehold.co/128x128/60a5fa/ffffff?text=JD",
  designation: "Software Engineer",
  department: "Engineering",
  employeeId: "EMP-12345",
};

const initialLeaveBalances: LeaveBalance[] = [
  { type: "Casual", balance: 10, total: 12, color: "bg-blue-500" },
  { type: "Sick", balance: 5, total: 6, color: "bg-green-500" },
  { type: "Paid", balance: 15, total: 15, color: "bg-indigo-500" },
];

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Company Holiday Announced",
    content: "The office will be closed on December 25th for the holidays.",
    date: "Dec 1, 2024",
  },
  {
    id: 2,
    title: "Q4 Performance Reviews",
    content: "Performance review forms are now available on the portal.",
    date: "Nov 25, 2024",
  },
];

const pendingLeaves: string[] = ["Request for leave on Dec 20, 2024"];

const tasks: Task[] = [
  { id: 1, name: "Complete Q4 Report", completed: false, deadline: "Dec 15" },
  { id: 2, name: "Update Project Alpha documentation", completed: true, deadline: "Dec 10" },
  { id: 3, name: "Review pull requests", completed: false, deadline: "Dec 18" },
];

const EmployeeOverview = () => {
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [workHours, setWorkHours] = useState<string>("0h 0m");
  const [showBirthdays, setShowBirthdays] = useState<boolean>(false);

  // A simple greeting message based on the current time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleCheckInToggle = () => {
    // This is a simplified toggle. A real app would track timestamps.
    setCheckedIn(!checkedIn);
    if (!checkedIn) {
      // Simulate tracking work hours after check-in
      setTimeout(() => setWorkHours("2h 30m"), 1000);
    } else {
      setWorkHours("0h 0m");
    }
  };

  const attendanceTrend = {
    present: 20,
    absent: 2,
    late: 3,
  };

  const analyticsData = {
    avgCheckIn: "8:55 AM",
    avgCheckOut: "5:35 PM",
    overtime: "5 hours",
    leaveVsBalance: "3 / 15 days",
    attendanceScore: 92,
  };

  return (
    <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
      <div className="space-y-8">
        {/* 1. Welcome & Profile Summary */}
        <section className="bg-white p-6 rounded-3xl shadow-lg flex items-center space-x-6">
          <img
            src={employeeProfile.photoUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {employeeProfile.name} 👋
            </h1>
            <p className="text-gray-600 font-medium">{employeeProfile.designation}</p>
            <p className="text-sm text-gray-500 mt-1">
              {employeeProfile.department} | Employee ID: {employeeProfile.employeeId}
            </p>
            <a href="#" className="text-indigo-600 hover:underline text-sm font-semibold mt-2 inline-block">
              View My Profile
            </a>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 2. Today’s Overview */}
          <section className="bg-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Today’s Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {checkedIn ? (
                  <CheckCircle size={24} className="text-green-500" />
                ) : (
                  <XCircle size={24} className="text-red-500" />
                )}
                <span className="font-semibold text-gray-700">Attendance:</span>
                <span className={`font-medium ${checkedIn ? "text-green-600" : "text-red-600"}`}>
                  {checkedIn ? "Checked In" : "Checked Out"}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={24} className="text-indigo-500" />
                <span className="font-semibold text-gray-700">Worked Hours Today:</span>
                <span className="font-medium text-gray-800">{workHours}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase size={24} className="text-yellow-500" />
                <span className="font-semibold text-gray-700">Shift:</span>
                <span className="font-medium text-gray-800">9:00 AM – 6:00 PM</span>
              </div>
            </div>
          </section>

          {/* 3. Quick Actions */}
          <section className="bg-white p-6 rounded-3xl shadow-lg col-span-1 lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={handleCheckInToggle}
                className={`flex flex-col items-center justify-center p-4 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-md ${
                  checkedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <Clock size={24} />
                <span className="mt-2 text-sm">{checkedIn ? "Check Out" : "Check In"}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-indigo-500 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:bg-indigo-600">
                <Clipboard size={24} />
                <span className="mt-2 text-sm">Apply for Leave</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-purple-500 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:bg-purple-600">
                <ListTodo size={24} />
                <span className="mt-2 text-sm">View Timesheet</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-orange-500 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:bg-orange-600">
                <Calendar size={24} />
                <span className="mt-2 text-sm">Attendance History</span>
              </button>
            </div>
          </section>
        </div>

        {/* 4. Leave & Attendance */}
        <section className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Leave & Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Leave Balance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Leave Balance</h3>
              <div className="space-y-4">
                {initialLeaveBalances.map((leave) => (
                  <div key={leave.type} className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-gray-100 font-bold text-gray-800 text-lg">
                      {leave.balance}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-700">{leave.type}</p>
                      <div className="w-full h-2 rounded-full bg-gray-200 mt-1">
                        <div
                          className={`${leave.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(leave.balance / leave.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {leave.balance} out of {leave.total}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pending Requests & Trend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Requests</h3>
              {pendingLeaves.length > 0 ? (
                <ul className="space-y-2">
                  {pendingLeaves.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-yellow-700 font-medium">
                      <AlertCircle size={16} />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No pending leave requests.</p>
              )}
              <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Attendance Trend</h3>
              <div className="flex justify-around items-center bg-gray-50 p-4 rounded-xl">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-green-600">{attendanceTrend.present}</span>
                  <span className="block text-sm text-gray-500">Present</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-red-600">{attendanceTrend.absent}</span>
                  <span className="block text-sm text-gray-500">Absent</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-orange-600">{attendanceTrend.late}</span>
                  <span className="block text-sm text-gray-500">Late</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Tasks / Work Updates */}
        <section className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tasks / Work Updates</h2>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center space-x-3">
                <CheckCircle
                  size={20}
                  className={`flex-shrink-0 ${task.completed ? "text-green-500" : "text-gray-300"}`}
                />
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? "text-gray-400 line-through" : "text-gray-800"}`}>
                    {task.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Deadline: {task.deadline}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. Announcements & Communication */}
        <section className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Announcements</h2>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-700">{announcement.title}</h3>
                <p className="text-sm text-gray-600">{announcement.content}</p>
                <p className="text-xs text-gray-400 mt-1">{announcement.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Analytics for Employee */}
        <section className="bg-white p-6 rounded-3xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <BarChart2 size={32} className="mx-auto text-indigo-500 mb-2" />
              <p className="text-lg font-bold text-gray-800">{analyticsData.avgCheckIn}</p>
              <p className="text-sm text-gray-500">Avg. Check-in</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Clock size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-lg font-bold text-gray-800">{analyticsData.overtime}</p>
              <p className="text-sm text-gray-500">Total Overtime</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <HandPlatter size={32} className="mx-auto text-red-500 mb-2" />
              <p className="text-lg font-bold text-gray-800">{analyticsData.leaveVsBalance}</p>
              <p className="text-sm text-gray-500">Leave Taken</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <Star size={32} className="mx-auto text-yellow-500 mb-2" />
              <p className="text-lg font-bold text-gray-800">{analyticsData.attendanceScore}%</p>
              <p className="text-sm text-gray-500">Attendance Score</p>
            </div>
          </div>
        </section>

        {/* 8. Extras */}
        <section className="bg-white p-6 rounded-3xl shadow-lg">
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setShowBirthdays(!showBirthdays)}>
            <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
            <ChevronDown size={24} className={`text-gray-500 transition-transform ${showBirthdays ? 'rotate-180' : ''}`} />
          </div>
          {showBirthdays && (
            <div className="space-y-4 animate-fade-in-down">
              <div className="flex items-center space-x-3 text-sm">
                <Gift size={20} className="text-pink-500" />
                <span>Happy birthday to <span className="font-semibold text-gray-800">David Wilson</span> this week!</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar size={20} className="text-green-500" />
                <span><span className="font-semibold text-gray-800">Christmas Party</span> - December 24th, 6 PM.</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Star size={20} className="text-yellow-500" />
                <span><span className="font-semibold text-gray-800">Linda White</span> is the Employee of the Month!</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Book size={20} className="text-blue-500" />
                <span>New training modules on <span className="font-semibold text-gray-800">Advanced React</span> are available.</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default EmployeeOverview;
