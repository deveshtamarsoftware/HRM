import React, { useState, useEffect, FC } from 'react';
import { PlusCircleIcon, CalendarIcon, BriefcaseIcon, CheckCircleIcon, XCircleIcon, ClockIcon, PaperclipIcon } from 'lucide-react';

// Main application component
const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <MyLeaves />
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
}

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

  // State management
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [newRequest, setNewRequest] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });
  // State to track if the file upload section should be visible
  const [showAttachment, setShowAttachment] = useState(false);

  // Effect to calculate and check leave duration whenever dates change
  useEffect(() => {
    if (newRequest.startDate && newRequest.endDate) {
      const start = new Date(newRequest.startDate);
      const end = new Date(newRequest.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      // Calculate difference in days (adding 1 to include both start and end days)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Show attachment section if leave is more than 3 days
      setShowAttachment(diffDays > 3);
    } else {
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
    const newId = leaveRequests.length > 0 ? Math.max(...leaveRequests.map(req => req.id)) + 1 : 1;
    const requestToAdd: LeaveRequest = {
      ...newRequest,
      id: newId,
      status: 'Pending',
    };
    setLeaveRequests(prev => [...prev, requestToAdd]);
    // Reset the form
    setNewRequest({ type: 'Annual Leave', startDate: '', endDate: '', reason: '' });
    setShowAttachment(false); // Reset attachment visibility
  };

  return (
    <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
            Employee Leaves Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-500">
            Apply for leave, check your balance, and view company holidays.
          </p>
        </header>

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
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={newRequest.startDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={newRequest.endDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            </div>
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

            {/* Conditional File Attachment Section */}
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
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Leave Status Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
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
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
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
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
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
      </div>
    </main>
  );
};

export default MyLeaves;
