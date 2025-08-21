import { useState, FC, ChangeEvent } from "react";
import {
  CheckCircle,
  XCircle,
  Hourglass,
  X,
  MessageSquare,
  Send,
  Info,
} from "lucide-react";

// --- Data Types ---
// Define a type for an employee, including their leave balances
export type Employee = {
  id: string;
  name: string;
  leaveBalances: Record<string, number>;
};

// Define a type for a leave request
export type LeaveRequest = {
  id: number;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  adminComment?: string;
};

// --- Initial Data ---
const initialEmployees: Employee[] = [
  {
    id: "emp1",
    name: "Divya Prakash",
    leaveBalances: { "Casual Leave": 10, "Sick Leave": 8, "Earned Leave": 12 },
  },
  {
    id: "emp2",
    name: "John Doe",
    leaveBalances: { "Casual Leave": 10, "Sick Leave": 10, "Earned Leave": 8 },
  },
  {
    id: "emp3",
    name: "Jane Smith",
    leaveBalances: { "Casual Leave": 10, "Sick Leave": 5, "Earned Leave": 15 },
  },
  {
    id: "emp4",
    name: "David Chen",
    leaveBalances: { "Casual Leave": 10, "Sick Leave": 15, "Earned Leave": 5 },
  },
  {
    id: "emp5",
    name: "Emily White",
    leaveBalances: { "Casual Leave": 10, "Sick Leave": 2, "Earned Leave": 18 },
  },
  {
    id: "emp6",
    name: "Michael Lee",
    leaveBalances: { "Casual Leave": 10, "Sick Leave": 9, "Earned Leave": 11 },
  },
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 101,
    employeeId: "emp1",
    employeeName: "Divya Prakash",
    startDate: "2024-09-01",
    endDate: "2024-09-03",
    type: "Earned Leave",
    reason: "Family vacation.",
    status: "Pending",
  },
  {
    id: 102,
    employeeId: "emp3",
    employeeName: "Jane Smith",
    startDate: "2024-08-20",
    endDate: "2024-08-20",
    type: "Sick Leave",
    reason: "Feeling unwell, need a day off to recover.",
    status: "Pending",
  },
  {
    id: 103,
    employeeId: "emp2",
    employeeName: "John Doe",
    startDate: "2024-08-18",
    endDate: "2024-08-22",
    type: "Earned Leave",
    reason: "Attending a conference.",
    status: "Approved",
    adminComment: "Approved, have a great conference!",
  },
  {
    id: 104,
    employeeId: "emp4",
    employeeName: "David Chen",
    startDate: "2024-08-25",
    endDate: "2024-08-26",
    type: "Casual Leave",
    reason: "Personal matters.",
    status: "Rejected",
    adminComment: "Unable to approve due to project deadline.",
  },
  {
    id: 105,
    employeeId: "emp6",
    employeeName: "Michael Lee",
    startDate: "2024-08-23",
    endDate: "2024-08-23",
    type: "Sick Leave",
    reason: "Dentist appointment.",
    status: "Pending",
  },
  {
    id: 106,
    employeeId: "emp5",
    employeeName: "Emily White",
    startDate: "2024-09-10",
    endDate: "2024-09-15",
    type: "Earned Leave",
    reason: "Planning a trip to the mountains.",
    status: "Pending",
  },
  {
    id: 107,
    employeeId: "emp1",
    employeeName: "Divya Prakash",
    startDate: "2024-08-28",
    endDate: "2024-08-28",
    type: "Sick Leave",
    reason: "Sudden fever, need to rest.",
    status: "Approved",
  },
  {
    id: 108,
    employeeId: "emp3",
    employeeName: "Jane Smith",
    startDate: "2024-09-25",
    endDate: "2024-09-27",
    type: "Casual Leave",
    reason: "Attending a family wedding.",
    status: "Pending",
  },
  {
    id: 109,
    employeeId: "emp5",
    employeeName: "Emily White",
    startDate: "2024-09-05",
    endDate: "2024-09-05",
    type: "Sick Leave",
    reason: "Migraine, will work from home.",
    status: "Pending",
  },
  {
    id: 110,
    employeeId: "emp6",
    employeeName: "Michael Lee",
    startDate: "2024-09-12",
    endDate: "2024-09-15",
    type: "Casual Leave",
    reason: "Long weekend trip with friends.",
    status: "Approved",
    adminComment: "Have a great trip, approved!",
  },
  {
    id: 111,
    employeeId: "emp4",
    employeeName: "David Chen",
    startDate: "2024-09-30",
    endDate: "2024-10-04",
    type: "Earned Leave",
    reason: "Going on a family cruise.",
    status: "Rejected",
    adminComment: "Project delivery deadline next week, can't approve.",
  },
];

// --- Helper Functions ---
const getLeaveStatusDisplay = (status: LeaveRequest["status"]) => {
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

// --- LeaveBalanceModal Component ---
interface LeaveBalanceModalProps {
  employee: Employee;
  onClose: () => void;
}

const LeaveBalanceModal: FC<LeaveBalanceModalProps> = ({
  employee,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm transform scale-95 animate-scale-in">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {employee.name}'s Leave Balance
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(employee.leaveBalances).map(([type, balance]) => (
            <div
              key={type}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
            >
              <span className="font-semibold text-gray-700">{type}:</span>
              <span className="text-lg font-bold text-gray-900">
                {balance} days
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Leaves Component ---
const Leaves: FC = () => {
  // We'll use local state for this self-contained component for now
  const [leaveRequests, setLeaveRequests] =
    useState<LeaveRequest[]>(initialLeaveRequests);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const [showLeaveDetailsModal, setShowLeaveDetailsModal] =
    useState<boolean>(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] =
    useState<LeaveRequest | null>(null);
  const [adminComment, setAdminComment] = useState<string>("");
  const [showLeaveBalanceModal, setShowLeaveBalanceModal] =
    useState<boolean>(false);
  const [selectedEmployeeForLeaveBalance, setSelectedEmployeeForLeaveBalance] =
    useState<Employee | null>(null);

  // --- Leave Management Functions ---
  const handleApproveLeave = (request: LeaveRequest) => {
    const days =
      Math.ceil(
        (new Date(request.endDate).getTime() -
          new Date(request.startDate).getTime()) /
          (1000 * 3600 * 24)
      ) + 1;
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === request.id ? { ...req, status: "Approved" } : req
      )
    );
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === request.employeeId) {
          const newBalances = { ...emp.leaveBalances };
          if (newBalances[request.type]) {
            newBalances[request.type] -= days;
          }
          return { ...emp, leaveBalances: newBalances };
        }
        return emp;
      })
    );
  };

  const handleRejectLeave = (request: LeaveRequest) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === request.id ? { ...req, status: "Rejected" } : req
      )
    );
  };

  const openLeaveDetailsModal = (request: LeaveRequest) => {
    setSelectedLeaveRequest(request);
    setAdminComment(request.adminComment || "");
    setShowLeaveDetailsModal(true);
  };

  const closeLeaveDetailsModal = () => {
    setSelectedLeaveRequest(null);
    setAdminComment("");
    setShowLeaveDetailsModal(false);
  };

  const handleAddComment = () => {
    if (selectedLeaveRequest) {
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req.id === selectedLeaveRequest.id
            ? { ...req, adminComment: adminComment }
            : req
        )
      );
      closeLeaveDetailsModal();
    }
  };

  const openLeaveBalanceModal = (employee: Employee) => {
    setSelectedEmployeeForLeaveBalance(employee);
    setShowLeaveBalanceModal(true);
  };

  const closeLeaveBalanceModal = () => {
    setSelectedEmployeeForLeaveBalance(null);
    setShowLeaveBalanceModal(false);
  };

  return (
       <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
              <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
        Leave Management 🌴
      </h1>

      <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
                <th className="px-6 py-4 text-center">Remaining Leave</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => {
                  const statusDisplay = getLeaveStatusDisplay(request.status);
                  const employee = employees.find(
                    (emp) => emp.id === request.employeeId
                  );
                  const remainingTotalLeave = employee
                    ? Object.values(employee.leaveBalances).reduce(
                        (sum, current) => sum + current,
                        0
                      )
                    : "N/A";
                  const daysRequested =
                    Math.ceil(
                      (new Date(request.endDate).getTime() -
                        new Date(request.startDate).getTime()) /
                        (1000 * 3600 * 24)
                    ) + 1;

                  return (
                    <tr
                      key={request.id}
                      className="hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {request.employeeName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {request.type}
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {request.startDate} to {request.endDate}{" "}
                        <span className="text-gray-400">
                          ({daysRequested} days)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800">
                            {request.reason}
                          </span>
                          {request.adminComment && (
                            <span className="text-gray-500 text-xs mt-1 italic">
                              Admin Comment: {request.adminComment}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.text} ${statusDisplay.bg}`}
                        >
                          {statusDisplay.icon}
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          {request.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApproveLeave(request)}
                                className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
                                title="Approve Leave"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleRejectLeave(request)}
                                className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                                title="Reject Leave"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openLeaveDetailsModal(request)}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                            title="View Details & Comment"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            employee && openLeaveBalanceModal(employee)
                          }
                          className="font-bold text-gray-800 flex items-center gap-1 justify-center"
                        >
                          {remainingTotalLeave}{" "}
                          <Info size={16} className="text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500 text-lg"
                  >
                    <p>No leave requests found. 🎉</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Details and Comment Modal */}
      {showLeaveDetailsModal && selectedLeaveRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform scale-95 animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                Leave Request Details
              </h2>
              <button
                onClick={closeLeaveDetailsModal}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 text-gray-700 mb-6">
              <p>
                <strong>Employee:</strong> {selectedLeaveRequest.employeeName}
              </p>
              <p>
                <strong>Type:</strong> {selectedLeaveRequest.type}
              </p>
              <p>
                <strong>Duration:</strong> {selectedLeaveRequest.startDate} to{" "}
                {selectedLeaveRequest.endDate}
              </p>
              <p>
                <strong>Reason:</strong> {selectedLeaveRequest.reason}
              </p>
              <p>
                <strong>Current Status:</strong>{" "}
                <span
                  className={`${
                    getLeaveStatusDisplay(selectedLeaveRequest.status).text
                  }`}
                >
                  {selectedLeaveRequest.status}
                </span>
              </p>
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="font-semibold text-gray-800 mb-2">
                  Admin Comment
                </p>
                <textarea
                  value={adminComment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setAdminComment(e.target.value)
                  }
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Add your comments here..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLeaveDetailsModal}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center gap-2"
              >
                <Send size={18} /> Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Balance Modal */}
      {showLeaveBalanceModal && selectedEmployeeForLeaveBalance && (
        <LeaveBalanceModal
          employee={selectedEmployeeForLeaveBalance}
          onClose={closeLeaveBalanceModal}
        />
      )}
    </main>
  );
};

export default Leaves;
