import { useState, FC } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Edit,
  Hourglass,
  X, // Added for the modal close button
} from "lucide-react";

// Define a type for a timesheet entry for type safety
type TimesheetEntry = {
  id: number;
  employeeName: string;
  date: string;
  hours: number;
  project: string;
  description: string;
  status: "Pending" | "Approved" | "Rejected";
};

// Define a type for a timesheet entry to be edited
type EditTimesheetEntry = Omit<TimesheetEntry, "id" | "employeeName">;

const Timesheets: FC = () => {
  // State for the timesheet entries
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([
    {
      id: 1,
      employeeName: "Divya Prakash",
      date: "2024-08-15",
      hours: 8.5,
      project: "HR Management System",
      description: "Working on employee directory features.",
      status: "Pending",
    },
    {
      id: 2,
      employeeName: "John Doe",
      date: "2024-08-14",
      hours: 7,
      project: "Customer Portal Redesign",
      description: "Meeting with client to finalize wireframes.",
      status: "Approved",
    },
    {
      id: 3,
      employeeName: "Jane Smith",
      date: "2024-08-15",
      hours: 9.0,
      project: "Marketing Campaign Launch",
      description: "Preparing ad creatives for social media platforms.",
      status: "Pending",
    },
    {
      id: 4,
      employeeName: "David Chen",
      date: "2024-08-13",
      hours: 8,
      project: "Project Orion",
      description: "Developing new API endpoints.",
      status: "Approved",
    },
    {
      id: 5,
      employeeName: "Emily White",
      date: "2024-08-12",
      hours: 7.5,
      project: "Data Analytics Dashboard",
      description: "Cleaning and processing raw data sets.",
      status: "Rejected",
    },
    {
      id: 6,
      employeeName: "Michael Lee",
      date: "2024-08-15",
      hours: 8,
      project: "HR Management System",
      description: "Testing new timesheet submission forms.",
      status: "Pending",
    },
  ]);

  // State for the search query
  const [query, setQuery] = useState<string>("");
  // State to control the visibility of the "Edit Timesheet" modal
  const [showModal, setShowModal] = useState<boolean>(false);
  // State to hold the entry currently being edited
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  // State to manage the input fields of the modal
  const [editFormData, setEditFormData] = useState<EditTimesheetEntry>({
    date: "",
    hours: 0,
    project: "",
    description: "",
    status: "Pending",
  });
  
  // State for a custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<{
    id: number;
    action: "approve" | "reject";
  } | null>(null);

  // Filters the timesheet entries based on the search query
  const filteredEntries = timesheetEntries.filter(
    (entry) =>
      entry.employeeName.toLowerCase().includes(query.toLowerCase()) ||
      entry.project.toLowerCase().includes(query.toLowerCase()) ||
      entry.status.toLowerCase().includes(query.toLowerCase())
  );

  // Opens the edit modal and pre-fills the form with the entry's data
  const openEditModal = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setEditFormData({
      date: entry.date,
      hours: entry.hours,
      project: entry.project,
      description: entry.description,
      status: entry.status,
    });
    setShowModal(true);
  };

  // Closes the edit modal and resets the state
  const closeModal = () => {
    setShowModal(false);
    setEditingEntry(null);
  };
  
  // Opens the confirmation modal
  const openConfirmModal = (id: number, action: "approve" | "reject") => {
    setConfirmAction({ id, action });
    setShowConfirmModal(true);
  };
  
  // Closes the confirmation modal
  const closeConfirmModal = () => {
    setConfirmAction(null);
    setShowConfirmModal(false);
  };

  // Handles the final confirmation and performs the action
  const handleConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.action === "approve") {
      handleApprove(confirmAction.id);
    } else {
      handleReject(confirmAction.id);
    }
    closeConfirmModal();
  };

  // Handles changes to the form inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "hours" ? parseFloat(value) || 0 : value,
    }));
  };

  // Saves the edited timesheet entry
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    setTimesheetEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === editingEntry.id
          ? {
              ...entry,
              ...editFormData,
            }
          : entry
      )
    );
    closeModal();
  };

  // Approves a timesheet entry
  const handleApprove = (id: number) => {
    setTimesheetEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, status: "Approved" } : entry
      )
    );
  };

  // Rejects a timesheet entry
  const handleReject = (id: number) => {
    setTimesheetEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, status: "Rejected" } : entry
      )
    );
  };

  // Get status color and icon
  const getStatusDisplay = (status: TimesheetEntry["status"]) => {
    switch (status) {
      case "Approved":
        return {
          text: "text-green-600",
          bg: "bg-green-100",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "Rejected":
        return {
          text: "text-red-600",
          bg: "bg-red-100",
          icon: <XCircle className="w-4 h-4" />,
        };
      default: // Pending
        return {
          text: "text-amber-600",
          bg: "bg-amber-100",
          icon: <Hourglass className="w-4 h-4" />,
        };
    }
  };
    

  return (
       <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
              <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Timesheet Management ⏳
          </h1>
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 w-full sm:w-64"
              placeholder="Search by name, project, or status..."
              aria-label="Search timesheet entries"
            />
          </div>
        </div>

        {/* Timesheet Table Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Project & Description</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => {
                    const statusDisplay = getStatusDisplay(entry.status);
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {entry.employeeName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <span className="font-bold text-gray-800">{entry.hours}</span> hrs
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">{entry.project}</span>
                            <span className="text-gray-500 text-sm mt-1">{entry.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.text} ${statusDisplay.bg}`}>
                            {statusDisplay.icon}
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(entry)}
                              className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                              aria-label={`Edit entry from ${entry.employeeName}`}
                              title="Edit Entry"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            {entry.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => openConfirmModal(entry.id, "approve")}
                                  className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
                                  aria-label={`Approve entry from ${entry.employeeName}`}
                                  title="Approve Timesheet"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => openConfirmModal(entry.id, "reject")}
                                  className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                                  aria-label={`Reject entry from ${entry.employeeName}`}
                                  title="Reject Timesheet"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-lg">
                      <p>No timesheet entries found for your search. 😔</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Timesheet Modal */}
        {showModal && editingEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform scale-95 animate-scale-in">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Timesheet for {editingEntry.employeeName}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form for editing */}
              <form onSubmit={handleSave} className="space-y-5">
                {/* Hours Input */}
                <div>
                  <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Worked
                  </label>
                  <input
                    id="hours"
                    name="hours"
                    type="number"
                    step="0.5"
                    value={editFormData.hours}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Project Input */}
                <div>
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <input
                    id="project"
                    name="project"
                    type="text"
                    value={editFormData.project}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Description Input */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={editFormData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
                {/* Status Dropdown */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={editFormData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Modal Action Buttons */}
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {showConfirmModal && confirmAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm transform scale-95 animate-scale-in">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                        Confirm Action
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                        Are you sure you want to {confirmAction.action} this timesheet entry?
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={closeConfirmModal}
                            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors duration-200 shadow-md ${
                                confirmAction.action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            {confirmAction.action === "approve" ? "Approve" : "Reject"}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </main>
  );
};

export default Timesheets;
