import React, { useState, useEffect, FC } from 'react';
import { UserCheckIcon, BriefcaseIcon, CalendarDaysIcon, ClockIcon, LucideProps, PlusCircleIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, PaperclipIcon, Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { SVGProps } from 'react';

// Main application component, including MyLeaves, MyAttendance, and Employees
const App = () => {
  const [employee, setEmployee] = useState([]);
  useEffect(() => {
     // Get value from .env
    const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
     console.log('VITE_API_BACKEND_URL', apiUrl)

    // Example fetch request
    fetch(`${apiUrl}/api`)
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data)
        setEmployee(data)
  })
  .catch((err) => console.error("Error fetching users:", err));
  }, []);
  
  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased">
      <main className="p-6 md:ml-64 mt-20 max-w-7xl mx-auto space-y-8">
        {/* Main dashboard header */}
        <header className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
            Employee Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-500">
            A centralized hub for your leaves, attendance, and employee directory.
          </p>
        </header>

        {/* Employees component section */}
        <Employees />

        {/* MyLeaves component section */}
        <MyLeaves />

        {/* MyAttendance component section */}
        <MyAttendance />
      </main>
    </div>
  );
};

// Represents a single leave request
interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  duration?: number;
}

// MyLeaves Component
const MyLeaves: FC = () => {
  // Mock data for leave balances and holidays
  const MOCK_LEAVE_BALANCES = {
    'Annual Leave': 15,
    'Sick Leave': 10,
    'Casual Leave': 5,
  };

  const MOCK_HOLIDAYS = [
    { date: '2024-12-25', name: 'Christmas Day' },
    { date: '2025-01-01', name: 'New Year\'s Day' },
    { date: '2025-07-04', name: 'Independence Day' },
  ];

  // State management for leave requests
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [newRequest, setNewRequest] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [showAttachment, setShowAttachment] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Effect to calculate and check leave duration whenever dates change
  useEffect(() => {
    if (newRequest.startDate && newRequest.endDate) {
      const start = new Date(newRequest.startDate);
      const end = new Date(newRequest.endDate);

      // Check if start date is after end date
      if (start > end) {
        setErrorMessage('Start date cannot be after end date.');
        setDuration(null);
        setShowAttachment(false);
        return;
      }

      setErrorMessage('');

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDuration(diffDays);
      
      setShowAttachment(diffDays > 3);
    } else {
      setDuration(null);
      setShowAttachment(false);
    }
  }, [newRequest.startDate, newRequest.endDate]);

  // Handle input changes for the leave request form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };

  // Handle submitting a new leave request
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (errorMessage) {
      return;
    }
    const newId = leaveRequests.length > 0 ? Math.max(...leaveRequests.map(req => req.id)) + 1 : 1;
    const requestToAdd: LeaveRequest = {
      ...newRequest,
      id: newId,
      status: 'Pending',
      duration: duration || 0,
    };
    setLeaveRequests(prev => [...prev, requestToAdd]);
    setNewRequest({ type: 'Annual Leave', startDate: '', endDate: '', reason: '' });
    setShowAttachment(false);
    setDuration(null);
  };

  return (
    <>
      {/* Apply for Leave Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <PlusCircleIcon className="w-5 h-5 text-blue-600" />
          <span>Apply for Leave</span>
        </h2>
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div>
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              id="leaveType"
              name="type"
              value={newRequest.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              {Object.keys(MOCK_LEAVE_BALANCES).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="relative mt-1">
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newRequest.startDate}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="relative mt-1">
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newRequest.endDate}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
          
          {duration !== null && duration > 0 && (
            <div className="text-sm font-medium text-gray-700">
              Total duration: <span className="font-bold text-blue-600">{duration} day{duration > 1 ? 's' : ''}</span>
            </div>
          )}
          
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              <p>{errorMessage}</p>
            </div>
          )}

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              id="reason"
              name="reason"
              rows={3}
              value={newRequest.reason}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          {showAttachment && (
            <div className="space-y-2 p-4 border border-dashed border-gray-300 rounded-lg">
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
                <PaperclipIcon className="w-4 h-4 text-gray-500" />
                <span>Attach relevant documents (e.g., a doctor's note)</span>
              </label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!!errorMessage || !newRequest.startDate || !newRequest.endDate}
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* Leave Status Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <ClockIcon className="w-5 h-5 text-gray-500" />
          <span>Leave Requests Status</span>
        </h2>
        {leaveRequests.length === 0 ? (
          <p className="text-gray-500 italic">You have no pending leave requests.</p>
        ) : (
          <ul className="space-y-4">
            {leaveRequests.map(req => (
              <li key={req.id} className="p-4 rounded-lg flex items-center space-x-4 border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex-shrink-0">
                  {req.status === 'Approved' && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                  {req.status === 'Pending' && <ClockIcon className="w-6 h-6 text-blue-500" />}
                  {req.status === 'Rejected' && <XCircleIcon className="w-6 h-6 text-red-500" />}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{req.type} from {req.startDate} to {req.endDate}</p>
                  <p className="text-sm text-gray-500">Reason: {req.reason}</p>
                  {req.duration !== undefined && (
                    <p className="text-xs text-gray-500">Duration: {req.duration} day{req.duration > 1 ? 's' : ''}</p>
                  )}
                  <p className="text-sm font-medium">Status: <span className={`font-semibold ${
                    req.status === 'Approved' ? 'text-green-600' :
                    req.status === 'Pending' ? 'text-blue-600' : 'text-red-600'
                  }`}>{req.status}</span></p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Leave Balances Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <BriefcaseIcon className="w-5 h-5 text-teal-500" />
          <span>Leave Balances</span>
        </h2>
        <ul className="space-y-2">
          {Object.entries(MOCK_LEAVE_BALANCES).map(([type, balance]) => (
            <li key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{type}</span>
              <span className="font-bold text-lg text-teal-600">{balance} days</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Company Holiday Calendar Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-pink-500" />
          <span>Company Holiday Calendar</span>
        </h2>
        <ul className="space-y-2">
          {MOCK_HOLIDAYS.map((holiday, index) => (
            <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">{holiday.name}</span>
              <span className="text-gray-500">{holiday.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

// MyAttendance component
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
    // Card container for the attendance section
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
  );
};

// Define a type for our Employee object for type safety
type Employee = {
  id: number;
  username: string;
  password?: string; // Made optional for display/editing
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  marital_status: string;
  role: string;
  profilePic: string;
  status: "pending" | "approved" | "rejected";
};

// Employees Component
const Employees: FC = () => {
  // State for the search query input
  const [query, setQuery] = useState<string>("");
  // State to control the visibility of the "Add/Edit Employee" modal
  const [showModal, setShowModal] = useState<boolean>(false);
  // State to control the visibility of the "Delete Employee" modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  // State to hold the ID of the employee to be deleted
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null);
  // State to hold the employee currently being edited, or null if adding a new one
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // State to manage the input fields for a new employee being added or an existing one being edited
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    username: "",
    password: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    marital_status: "",
    role: "",
    profilePic: "",
    status: "pending",
  });

  // Employee data managed by state to allow adding, editing, and deleting.
  const [employees, setEmployees] = useState<Employee[]>([
    // Mock data with all the new fields
    { id: 1, username: "divya.prakash", password: "password1", email: "divya@example.com", phone_number: "555-1234", first_name: "Divya", last_name: "Prakash", dob: "1990-05-15", gender: "Female", marital_status: "Single", role: "HR Manager", profilePic: "https://randomuser.me/api/portraits/women/1.jpg", status: "approved" },
    { id: 2, username: "john.doe", password: "password2", email: "john@example.com", phone_number: "555-5678", first_name: "John", last_name: "Doe", dob: "1985-08-20", gender: "Male", marital_status: "Married", role: "Software Engineer", profilePic: "https://randomuser.me/api/portraits/men/2.jpg", status: "approved" },
    { id: 3, username: "jane.smith", password: "password3", email: "jane@example.com", phone_number: "555-9012", first_name: "Jane", last_name: "Smith", dob: "1992-03-10", gender: "Female", marital_status: "Single", role: "UI/UX Designer", profilePic: "https://randomuser.me/api/portraits/women/3.jpg", status: "pending" },
    { id: 4, username: "david.chen", password: "password4", email: "david@example.com", phone_number: "555-3456", first_name: "David", last_name: "Chen", dob: "1988-11-25", gender: "Male", marital_status: "Married", role: "Product Manager", profilePic: "https://randomuser.me/api/portraits/men/4.jpg", status: "approved" },
    { id: 5, username: "emily.white", password: "password5", email: "emily@example.com", phone_number: "555-7890", first_name: "Emily", last_name: "White", dob: "1995-02-01", gender: "Female", marital_status: "Single", role: "Data Analyst", profilePic: "https://randomuser.me/api/portraits/women/5.jpg", status: "approved" },
    { id: 6, username: "michael.lee", password: "password6", email: "michael@example.com", phone_number: "555-2345", first_name: "Michael", last_name: "Lee", dob: "1987-09-30", gender: "Male", marital_status: "Single", role: "Marketing Specialist", profilePic: "https://randomuser.me/api/portraits/men/6.jpg", status: "rejected" },
    { id: 7, username: "sarah.connor", password: "password7", email: "sarah@example.com", phone_number: "555-6789", first_name: "Sarah", last_name: "Connor", dob: "1991-04-05", gender: "Female", marital_status: "Married", role: "DevOps Engineer", profilePic: "https://randomuser.me/api/portraits/women/7.jpg", status: "approved" },
    { id: 8, username: "robert.johnson", password: "password8", email: "robert@example.com", phone_number: "555-1122", first_name: "Robert", last_name: "Johnson", dob: "1983-06-22", gender: "Male", marital_status: "Married", role: "QA Tester", profilePic: "https://randomuser.me/api/portraits/men/8.jpg", status: "approved" },
  ]);

  // Filters the list of employees based on the search query.
  const filteredEmployees: Employee[] = employees.filter(
    (emp) =>
      emp.first_name.toLowerCase().includes(query.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(query.toLowerCase()) ||
      emp.email.toLowerCase().includes(query.toLowerCase()) ||
      emp.role.toLowerCase().includes(query.toLowerCase())
  );
  
  // Handles the submission of the "Add/Edit Employee" form.
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // In a real application, you'd handle profile picture upload and URL here
    const finalProfilePic = newEmployee.profilePic || `https://placehold.co/40x40/cccccc/000000?text=${newEmployee.first_name.charAt(0).toUpperCase()}`;

    if (editingEmployee) {
      // If editing an existing employee
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === editingEmployee.id ? { ...emp, ...newEmployee, id: emp.id, profilePic: finalProfilePic } : emp
        )
      );
    } else {
      // If adding a new employee
      const newId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
      setEmployees((prevEmployees) => [
        ...prevEmployees,
        { ...newEmployee, id: newId, profilePic: finalProfilePic, status: "pending" },
      ]);
    }
    closeModal(); // Close the modal after saving
  };

  // Handles changes in the input fields of the new/edit employee form.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Opens the modal for adding a new employee
  const openAddModal = () => {
    setEditingEmployee(null); // Clear any previously selected employee for editing
    setNewEmployee({ 
      username: "",
      password: "",
      email: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      dob: "",
      gender: "",
      marital_status: "",
      role: "",
      profilePic: "",
      status: "pending",
    }); // Reset form fields
    setShowModal(true);
  };

  // Opens the modal for editing an existing employee
  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee); // Set the employee to be edited
    setNewEmployee({ // Pre-fill the form with employee's current data
      username: employee.username,
      password: "", // Do not pre-fill password for security
      email: employee.email,
      phone_number: employee.phone_number,
      first_name: employee.first_name,
      last_name: employee.last_name,
      dob: employee.dob,
      gender: employee.gender,
      marital_status: employee.marital_status,
      role: employee.role,
      profilePic: employee.profilePic,
      status: employee.status,
    });
    setShowModal(true);
  };

  // Closes the modal and resets editing state
  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setNewEmployee({
      username: "",
      password: "",
      email: "",
      phone_number: "",
      first_name: "",
      last_name: "",
      dob: "",
      gender: "",
      marital_status: "",
      role: "",
      profilePic: "",
      status: "pending",
    });
  };

  // Opens the delete confirmation modal
  const openDeleteModal = (id: number) => {
    setDeletingEmployeeId(id);
    setShowDeleteModal(true);
  };

  // Closes the delete confirmation modal
  const closeDeleteModal = () => {
    setDeletingEmployeeId(null);
    setShowDeleteModal(false);
  };

  // Handles deleting an employee
  const handleDeleteEmployee = () => {
    if (deletingEmployeeId !== null) {
      setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== deletingEmployeeId));
      closeDeleteModal();
    }
  };
  
  return (
    <div className="bg-white p-6 md:ml-64 mt-20 rounded-2xl shadow-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
          Employee Directory ✨
        </h1>
        <div className="flex items-center gap-4 w-full sm:w-auto flex-col sm:flex-row">
          {/* Search Input with an icon */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 w-full sm:w-64"
              placeholder="Search by name, email, or role..."
              aria-label="Search employees"
            />
          </div>
          {/* "Add Employee" Button with scale effect */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md transform hover:scale-105 active:scale-98 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" /> Add Employee
          </button>
        </div>
      </div>

      {/* Employees Table Section */}
      <div className="mt-8 bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                    <td className="px-6 py-4 text-gray-800 font-medium flex items-center gap-3">
                      <img 
                        src={emp.profilePic} 
                        alt={`${emp.first_name}'s profile`} 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => { 
                          e.currentTarget.src = `https://placehold.co/40x40/cccccc/000000?text=${emp.first_name.charAt(0).toUpperCase()}`;
                          e.currentTarget.onerror = null;
                        }}
                      />
                      <span>{emp.first_name} {emp.last_name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.phone_number}</td>
                    <td className="px-6 py-4 text-gray-600">{emp.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full
                        ${emp.status === 'approved' ? 'bg-green-100 text-green-800' :
                          emp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`
                        }>
                          {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                          aria-label={`Edit ${emp.first_name}`}
                          title="Edit Employee"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(emp.id)}
                          className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                          aria-label={`Delete ${emp.first_name}`}
                          title="Delete Employee"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-lg">
                    <p>No employees found for your search. 😔 Please try a different query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl transform scale-95 animate-scale-in">
            {/* Modal Header with title and close button */}
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form for adding/editing an employee */}
            <form onSubmit={handleSaveEmployee} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* First Name Input */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="e.g. Jane"
                    value={newEmployee.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Last Name Input */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="e.g. Doe"
                    value={newEmployee.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="e.g. jane.doe"
                    value={newEmployee.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Set a password"
                    value={newEmployee.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required={!editingEmployee}
                  />
                </div>
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. jane.doe@company.com"
                    value={newEmployee.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Phone Number Input */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="e.g. 555-1234"
                    value={newEmployee.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                {/* Date of Birth Input */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={newEmployee.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Gender Select */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={newEmployee.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {/* Marital Status Select */}
                <div>
                  <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select
                    id="marital_status"
                    name="marital_status"
                    value={newEmployee.marital_status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                {/* Role Input */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={newEmployee.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Profile Picture URL Input */}
                <div>
                  <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                  <input
                    id="profilePic"
                    name="profilePic"
                    type="url"
                    placeholder="e.g. https://example.com/profile.jpg"
                    value={newEmployee.profilePic}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: A URL to the employee's profile image.</p>
                </div>
              </div>
              
              {/* Modal Action Buttons (Cancel and Save) */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  {editingEmployee ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm transform scale-95 animate-scale-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
