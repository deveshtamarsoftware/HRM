import React, { useState, useEffect } from "react";

// Define the data types for better code clarity using TypeScript interfaces.
interface Employee {
  id: number;
  name: string;
}

interface AttendanceRecord {
  employeeId: number;
  date: string; // Using a string for simplicity, e.g., 'YYYY-MM-DD'
  checkInTime?: string;
  checkOutTime?: string;
  status: "Present" | "Absent" | "On Leave";
}

// Mock data to simulate fetching from an API.
// In a real application, this data would come from a database.
const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Williams" },
  { id: 3, name: "Charlie Brown" },
  { id: 4, name: "Diana Miller" },
  { id: 5, name: "Ethan Davis" },
];

// This mock data includes check-in/check-out times and a mix of attendance records.
const MOCK_ATTENDANCE_DATA: AttendanceRecord[] = [
  // Today's records for summary (some on-time, some late)
  {
    employeeId: 1,
    date: "2025-08-19",
    status: "Present",
    checkInTime: "08:55 AM",
    checkOutTime: "05:05 PM",
  },
  {
    employeeId: 2,
    date: "2025-08-19",
    status: "Present",
    checkInTime: "09:15 AM",
    checkOutTime: "05:30 PM",
  }, // Late
  { employeeId: 3, date: "2025-08-19", status: "Absent" },
  { employeeId: 4, date: "2025-08-19", status: "On Leave" },
  {
    employeeId: 5,
    date: "2025-08-19",
    status: "Present",
    checkInTime: "08:45 AM",
    checkOutTime: "05:00 PM",
  },
  // Additional historical data for weekly/monthly view
  {
    employeeId: 1,
    date: "2025-08-18",
    status: "Present",
    checkInTime: "09:00 AM",
    checkOutTime: "05:00 PM",
  },
  { employeeId: 1, date: "2025-08-17", status: "On Leave" },
  {
    employeeId: 1,
    date: "2025-08-16",
    status: "Present",
    checkInTime: "09:05 AM",
    checkOutTime: "05:15 PM",
  },
  {
    employeeId: 1,
    date: "2025-08-15",
    status: "Present",
    checkInTime: "08:50 AM",
    checkOutTime: "05:05 PM",
  },
  {
    employeeId: 2,
    date: "2025-08-18",
    status: "Present",
    checkInTime: "08:58 AM",
    checkOutTime: "05:02 PM",
  },
  {
    employeeId: 2,
    date: "2025-08-17",
    status: "Present",
    checkInTime: "09:02 AM",
    checkOutTime: "05:07 PM",
  },
  {
    employeeId: 2,
    date: "2025-08-16",
    status: "Present",
    checkInTime: "09:10 AM",
    checkOutTime: "05:20 PM",
  },
  { employeeId: 2, date: "2025-08-15", status: "Absent" },
  { employeeId: 3, date: "2025-08-18", status: "Absent" },
  { employeeId: 3, date: "2025-08-17", status: "Absent" },
  {
    employeeId: 3,
    date: "2025-08-16",
    status: "Present",
    checkInTime: "09:01 AM",
    checkOutTime: "05:09 PM",
  },
  {
    employeeId: 3,
    date: "2025-08-15",
    status: "Present",
    checkInTime: "08:59 AM",
    checkOutTime: "05:04 PM",
  },
];

const Attendance = () => {
  // State variables to manage the component's data and UI.
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    onLeave: 0,
    late: 0,
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  ); // Null means all employees are selected.
  const [viewPeriod, setViewPeriod] = useState<"weekly" | "monthly">("weekly");
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(
    []
  );

  // New state variables for the search functionality.
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  // The standard office start time for calculating lateness.
  const LATE_TIME = 9 * 60 + 0; // 9:00 AM in minutes

  // Function to calculate the attendance summary for the current day.
  const calculateDailySummary = () => {
    // Get today's date in 'YYYY-MM-DD' format.
    const today = new Date().toISOString().slice(0, 10);
    // Filter the mock data for today's records.
    const todayRecords = MOCK_ATTENDANCE_DATA.filter(
      (record) => record.date === today
    );

    // Count the number of employees for each status.
    const presentCount = todayRecords.filter(
      (record) => record.status === "Present"
    ).length;
    const absentCount = todayRecords.filter(
      (record) => record.status === "Absent"
    ).length;
    const onLeaveCount = todayRecords.filter(
      (record) => record.status === "On Leave"
    ).length;

    // Count late arrivals
    const lateCount = todayRecords.filter((record) => {
      if (record.status === "Present" && record.checkInTime) {
        // Parse the time string to compare against LATE_TIME.
        const [time, ampm] = record.checkInTime.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let checkInHours = hours;
        if (ampm === "PM" && checkInHours < 12) {
          checkInHours += 12;
        }
        const checkInMinutes = checkInHours * 60 + minutes;
        return checkInMinutes > LATE_TIME;
      }
      return false;
    }).length;

    // Update the summary state.
    setSummary({
      present: presentCount,
      absent: absentCount,
      onLeave: onLeaveCount,
      late: lateCount,
    });
  };

  // Function to filter attendance records for a specific employee and period.
  const filterEmployeeAttendance = () => {
    const today = new Date();
    let records = MOCK_ATTENDANCE_DATA;

    // Filter records by the selected employee if one is chosen.
    if (selectedEmployeeId !== null) {
      records = MOCK_ATTENDANCE_DATA.filter(
        (record) => record.employeeId === selectedEmployeeId
      );
    }

    // Filter records by the selected period (weekly or monthly).
    let startPeriod: Date;
    if (viewPeriod === "weekly") {
      startPeriod = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
      );
    } else {
      startPeriod = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
    }

    const filtered = records.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startPeriod && recordDate <= today;
    });

    // Sort the records from newest to oldest date.
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setFilteredRecords(filtered);
  };

  // useEffect to calculate the initial daily summary.
  useEffect(() => {
    calculateDailySummary();
  }, []); // Empty dependency array means this runs only once on mount.

  // useEffect to filter employee attendance records whenever the selected employee or view period changes.
  useEffect(() => {
    filterEmployeeAttendance();
  }, [selectedEmployeeId, viewPeriod]); // Reruns when employee or period changes.

  // useEffect to filter the list of employees based on the search query.
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = MOCK_EMPLOYEES.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]); // Clear the list if the search query is empty.
    }
  }, [searchQuery]);

  const handleSelectEmployee = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setSearchQuery(""); // Clear the search query after an employee is selected.
  };

  const handleShowAll = () => {
    setSelectedEmployeeId(null);
    setSearchQuery("");
  };

  // Get the name of the currently selected employee for display.
  const selectedEmployee = MOCK_EMPLOYEES.find(
    (emp) => emp.id === selectedEmployeeId
  );

  // Helper function to determine if an employee was late on a given day.
  const isLate = (checkInTime: string | undefined): boolean => {
    if (!checkInTime) return false;
    // Parse the time string, handling AM/PM
    const [time, ampm] = checkInTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let checkInHours = hours;
    if (ampm === "PM" && checkInHours < 12) {
      checkInHours += 12;
    } else if (ampm === "AM" && checkInHours === 12) {
      // Handle 12:xx AM
      checkInHours = 0;
    }
    const checkInMinutes = checkInHours * 60 + minutes;
    return checkInMinutes > LATE_TIME;
  };

  // Helper function to get the status text for the table.
  const getStatusText = (record: AttendanceRecord): string => {
    if (record.status === "Present") {
      return isLate(record.checkInTime)
        ? "Present (Late)"
        : "Present (On-Time)";
    }
    return record.status;
  };

  return (
    <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-4xl pb-4 font-extrabold text-gray-800 tracking-tight">
        Attendance Dashboard
      </h1>

      {/* Attendance Summary Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Today's Summary ({new Date().toLocaleDateString()})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center">
          {/* Present Count Card */}
          <div className="bg-green-100 p-6 rounded-lg shadow-sm border border-green-200">
            <p className="text-4xl font-bold text-green-700">
              {summary.present}
            </p>
            <p className="text-lg text-green-600">Present</p>
          </div>
          {/* Absent Count Card */}
          <div className="bg-red-100 p-6 rounded-lg shadow-sm border border-red-200">
            <p className="text-4xl font-bold text-red-700">{summary.absent}</p>
            <p className="text-lg text-red-600">Absent</p>
          </div>
          {/* On Leave Count Card */}
          <div className="bg-yellow-100 p-6 rounded-lg shadow-sm border border-yellow-200">
            <p className="text-4xl font-bold text-yellow-700">
              {summary.onLeave}
            </p>
            <p className="text-lg text-yellow-600">On Leave</p>
          </div>
          {/* Late Count Card */}
          <div className="bg-orange-100 p-6 rounded-lg shadow-sm border border-orange-200">
            <p className="text-4xl font-bold text-orange-700">{summary.late}</p>
            <p className="text-lg text-orange-600">Late Arrivals</p>
          </div>
        </div>
      </div>

      {/* Individual Employee Attendance Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Employee Attendance Details
        </h2>

        {/* Controls for filtering */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 relative">
          {/* Employee Search Box */}
          <div className="w-full sm:w-auto flex-grow relative">
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 text-base border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchQuery.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      onClick={() => handleSelectEmployee(employee.id)}
                    >
                      {employee.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Display selected employee's name and 'Show All' button */}
          <div className="flex w-full sm:w-auto mt-2 sm:mt-0 items-center gap-2">
            {selectedEmployee && (
              <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md shadow-sm text-sm font-medium">
                Viewing: {selectedEmployee.name}
              </div>
            )}
            <button
              onClick={handleShowAll}
              className="py-2 px-4 rounded-md font-medium text-sm transition-all duration-200
                bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Show All
            </button>
          </div>

          {/* Period Selector */}
          <div className="flex w-full sm:w-auto mt-2 sm:mt-0">
            <button
              onClick={() => setViewPeriod("weekly")}
              className={`py-2 px-4 rounded-l-md font-medium text-sm transition-all duration-200
                ${
                  viewPeriod === "weekly"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewPeriod("monthly")}
              className={`py-2 px-4 rounded-r-md font-medium text-sm transition-all duration-200
                ${
                  viewPeriod === "monthly"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Employee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Check-in
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Check-out
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => {
                  const employee = MOCK_EMPLOYEES.find(
                    (emp) => emp.id === record.employeeId
                  );
                  return (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.checkInTime || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.checkOutTime || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            record.status === "Present" &&
                            isLate(record.checkInTime)
                              ? "bg-red-100 text-red-800"
                              : record.status === "Present"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {getStatusText(record)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No attendance records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Attendance;
