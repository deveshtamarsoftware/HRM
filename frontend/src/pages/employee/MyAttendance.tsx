import React, { useState, useEffect, FC } from 'react';
import { UserCheckIcon, BriefcaseIcon, CalendarDaysIcon, ClockIcon, LucideProps } from 'lucide-react';
import { SVGProps } from 'react';

// Main application component, including both MyLeaves and MyAttendance
const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased">
      <main className="p-6 md:ml-64 mt-20 max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
            Employee Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-500">
            A centralized hub for your leaves and attendance.
          </p>
        </header>
        <MyAttendance />
      </main>
    </div>
  );
};

// MyAttendance component based on the user's request
const MyAttendance: FC = () => {
  // State for attendance records
  const [attendance, setAttendance] = useState([
    {
      date: "2025-08-14",
      status: "Present",
      checkIn: "09:10 AM",
      checkOut: "06:05 PM",
    },
    {
      date: "2025-08-15",
      status: "Present",
      checkIn: "09:05 AM",
      checkOut: "06:00 PM",
    },
  ]);

  // State to track if the user is currently checked in
  const [checkedIn, setCheckedIn] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Handler for Check-In button click
  const handleCheckIn = () => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add a new attendance record for today
    setAttendance((prev) => [
      { date: today, status: "Present", checkIn: now, checkOut: "-" },
      ...prev,
    ]);
    setCheckedIn(true);
  };

  // Handler for Check-Out button click
  const handleCheckOut = () => {
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Update the most recent attendance record with the check-out time
    setAttendance((prev) =>
      prev.map((record, idx) =>
        idx === 0 && record.date === today
          ? { ...record, checkOut: now }
          : record
      )
    );
    setCheckedIn(false);
  };

  return (
    // Card container for the attendance section, styled to match the dashboard
    
            <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">

    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <UserCheckIcon className="w-5 h-5 text-purple-600" />
        <span>My Attendance</span>
      </h2>

      {/* Actions section with styled buttons */}
      <div className="flex gap-4 mb-6">
        {!checkedIn ? (
          <button
            onClick={handleCheckIn}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Check In
          </button>
        ) : (
          <button
            onClick={handleCheckOut}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Check Out
          </button>
        )}
      </div>

      {/* Attendance Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="px-4 font-semibold">Status</th>
              <th className="px-4 font-semibold">Check-In</th>
              <th className="px-4 font-semibold">Check-Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-gray-700">{row.date}</td>
                <td className="px-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {row.status}
                  </span>
                </td>
                <td className="px-4 text-gray-700">{row.checkIn}</td>
                <td className="px-4 text-gray-700">{row.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </main>
  );
};

export default App;
