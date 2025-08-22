import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon, FolderIcon } from 'lucide-react';

// Main application component
const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <MyTimesheets />
    </div>
  );
};

// Represents a single timesheet entry for a project in a week
interface TimesheetEntry {
  projectId: string;
  projectName: string;
  description: string;
  hours: number[]; // Array of 7 numbers for Mon-Sun
}

// Represents a submitted timesheet
interface SubmittedTimesheet {
  week: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  entries: TimesheetEntry[];
}

const MyTimesheets = () => {
  // Mock data for projects and a list of submitted timesheets
  const MOCK_PROJECTS = [
    { id: 'proj-1', name: 'Project Alpha' },
    { id: 'proj-2', name: 'Project Beta' },
    { id: 'proj-3', name: 'Client X Rebranding' },
    { id: 'proj-4', name: 'Internal Tool Development' },
  ];

  const MOCK_SUBMITTED_TIMESHEETS: SubmittedTimesheet[] = [
    { week: '2025-07-28', status: 'Approved', entries: [] },
    { week: '2025-07-21', status: 'Submitted', entries: [] },
    { week: '2025-07-14', status: 'Rejected', entries: [] },
  ];

  // State management
  const [timesheet, setTimesheet] = useState<TimesheetEntry[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [dailyTotalAlert, setDailyTotalAlert] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  // Constants for days of the week (Mon-Fri based on image)
  const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Effect to update the daily total alert whenever timesheet data changes
  useEffect(() => {
    // Calculate daily totals
    const dailyTotals = Array(DAYS_OF_WEEK.length).fill(0);
    timesheet.forEach(entry => {
      entry.hours.forEach((hour, index) => {
        dailyTotals[index] += parseFloat(hour.toString()) || 0;
      });
    });

    // Check if any day exceeds 8 hours (using a reasonable default)
    const exceededDayIndex = dailyTotals.findIndex(total => total > 8);
    if (exceededDayIndex !== -1) {
      setDailyTotalAlert(`Warning: ${DAYS_OF_WEEK[exceededDayIndex]} total hours exceed 8.`);
    } else {
      setDailyTotalAlert(null);
    }
  }, [timesheet]);

  // Handle adding a new project row to the timesheet
  const handleAddProject = () => {
    if (!selectedProject || timesheet.some(entry => entry.projectId === selectedProject)) {
      return; // Prevent adding the same project twice
    }
    const project = MOCK_PROJECTS.find(p => p.id === selectedProject);
    if (project) {
      const newEntry: TimesheetEntry = {
        projectId: project.id,
        projectName: project.name,
        description: '',
        hours: Array(DAYS_OF_WEEK.length).fill(0),
      };
      setTimesheet([...timesheet, newEntry]);
      setSelectedProject(''); // Clear selection after adding
    }
  };

  // Handle changes to hours input
  const handleHoursChange = (projectIndex: number, dayIndex: number, value: string) => {
    const newTimesheet = [...timesheet];
    const hoursValue = parseFloat(value);
    newTimesheet[projectIndex].hours[dayIndex] = isNaN(hoursValue) || hoursValue < 0 ? 0 : hoursValue;
    setTimesheet(newTimesheet);
  };

  // Calculate the total hours for a single project (row total)
  const calculateProjectTotal = (hours: number[]) => {
    return hours.reduce((sum, current) => sum + (parseFloat(current.toString()) || 0), 0).toFixed(0);
  };

  // Calculate the total hours for a single day (column total)
  const calculateDailyTotal = (dayIndex: number) => {
    return timesheet.reduce((sum, entry) => sum + (parseFloat(entry.hours[dayIndex].toString()) || 0), 0).toFixed(0);
  };

  // Calculate the grand total for the entire timesheet
  const calculateGrandTotal = () => {
    return timesheet.reduce((sum, entry) => sum + parseFloat(calculateProjectTotal(entry.hours)), 0).toFixed(0);
  };

  // Handle Save Timesheet button
  const handleSaveTimesheet = () => {
    console.log('Saving timesheet:', timesheet);
    setSubmissionStatus('Timesheet saved successfully!');
    setTimeout(() => setSubmissionStatus(null), 3000);
  };

  return (
    <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Weekly TimeSheet</h1>

        {/* Date Range Pickers */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
          <div>
            <label className="text-gray-600 block mb-1">From Date</label>
            <input type="date" className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800" />
          </div>
          <div>
            <label className="text-gray-600 block mb-1">To Date</label>
            <input type="date" className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800" />
          </div>
        </div>

        {dailyTotalAlert && (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl shadow-md border-l-4 border-red-500">
            <p className="font-semibold">{dailyTotalAlert}</p>
          </div>
        )}

        {/* Timesheet Entry Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-sm">
                <th className="py-3 px-6 text-left w-16">#</th>
                <th className="py-3 px-6 text-left w-48">Project</th>
                {DAYS_OF_WEEK.map((day, index) => (
                  <th key={index} className="py-3 px-6 text-center">{day}</th>
                ))}
                <th className="py-3 px-6 text-center w-24">Total Hrs</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {timesheet.length === 0 ? (
                <tr>
                  <td colSpan={DAYS_OF_WEEK.length + 3} className="text-center py-6 text-gray-500">
                    No projects added. Use the dropdown below to start.
                  </td>
                </tr>
              ) : (
                timesheet.map((entry, projectIndex) => (
                  <tr key={entry.projectId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 text-center">{projectIndex + 1}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {entry.projectName}
                    </td>
                    {entry.hours.map((hour, dayIndex) => (
                      <td key={dayIndex} className="py-4 px-2 text-center">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={hour === 0 ? '' : hour} // Show empty for 0 to improve UX
                          onChange={(e) => handleHoursChange(projectIndex, dayIndex, e.target.value)}
                          className="w-full px-2 py-1 text-center bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                      </td>
                    ))}
                    <td className="py-4 px-6 text-center font-bold text-gray-800">
                      {calculateProjectTotal(entry.hours)}
                    </td>
                  </tr>
                ))
              )}
              {/* Daily Totals Row */}
              <tr className="bg-blue-50 border-t-2 border-blue-200 text-gray-800 font-bold">
                <td className="py-4 px-6" colSpan={2}>Total</td>
                {DAYS_OF_WEEK.map((_, index) => (
                  <td key={index} className="py-4 px-6 text-center">
                    {calculateDailyTotal(index)}
                  </td>
                ))}
                <td className="py-4 px-6 text-center">{calculateGrandTotal()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Project Selection Dropdown */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <label htmlFor="project-select" className="text-gray-700 font-medium">Select a project:</label>
          <select
            id="project-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="flex-grow px-4 py-2 bg-gray-50 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="" disabled>Select a project to add</option>
            {MOCK_PROJECTS.filter(p => !timesheet.some(entry => entry.projectId === p.id)).map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          <button
            onClick={handleAddProject}
            disabled={!selectedProject}
            className={`px-6 py-2 rounded-lg font-medium text-white shadow-md transition-colors ${selectedProject ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-300 cursor-not-allowed'}`}
          >
            Add
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => {}} // No functionality for "Back" in this standalone component
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors shadow-md"
            >
              Back
            </button>
            <button
              onClick={handleSaveTimesheet}
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors shadow-md"
            >
              Save Timesheet
            </button>
        </div>

        {submissionStatus && (
          <div className="mt-4 p-3 text-center text-sm font-medium text-white bg-green-500 rounded-lg animate-pulse">
            {submissionStatus}
          </div>
        )}
        
        {/* Timesheet History */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Timesheet History</h2>
          <ul className="space-y-3">
            {MOCK_SUBMITTED_TIMESHEETS.map((ts, index) => (
              <li key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {ts.status === 'Approved' && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                  {ts.status === 'Submitted' && <ClockIcon className="w-6 h-6 text-blue-500" />}
                  {ts.status === 'Rejected' && <XCircleIcon className="w-6 h-6 text-red-500" />}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-700">Week of {ts.week}</p>
                  <p className="text-sm text-gray-500">Status: <span className={`font-medium ${ts.status === 'Approved' ? 'text-green-600' : ts.status === 'Submitted' ? 'text-blue-600' : 'text-red-600'}`}>{ts.status}</span></p>
                </div>
                <button className="px-4 py-2 text-sm text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MyTimesheets;
