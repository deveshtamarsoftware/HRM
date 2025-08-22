// src/pages/employee/MyProfile.tsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Award,
  Book,
  FileText,
  Upload,
  ClipboardCheck,
  Edit,
  Building2,
  Home,
  Heart,
  CalendarDays,
  ListTodo,
  CheckCircle,
  XCircle,
} from "lucide-react";

// This interface defines the shape of the profile data
interface MyProfileData {
  basicInfo: {
    name: string;
    photoUrl: string;
    employeeId: string;
    designation: string;
    department: string;
    joiningDate: string;
    workLocation: string;
  };
  personalDetails: {
    email: string;
    phone: string;
    currentAddress: string;
    permanentAddress: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup: string;
    emergencyContact: {
      name: string;
      relation: string;
      number: string;
    };
  };
  workInfo: {
    reportingManager: string;
    workMode: string;
    shiftTiming: string;
    employmentType: string;
    employeeStatus: string;
  };
  documents: {
    name: string;
    status: "Verified" | "Pending";
  }[];
  leaveSnapshot: {
    casual: number;
    sick: number;
    earned: number;
  };
  attendanceSummary: {
    present: number;
    absent: number;
    late: number;
    wfh: number;
  };
  skills: {
    education: string[];
    certifications: string[];
    competencies: string[];
  };
  otherSections: {
    tenure: string;
    awards: string[];
    assignedProjects: { name: string; status: string }[];
  };
}

// Mock data to populate the profile
const profileData: MyProfileData = {
  basicInfo: {
    name: "Jane Doe",
    photoUrl: "https://placehold.co/128x128/60a5fa/ffffff?text=JD",
    employeeId: "EMP-12345",
    designation: "Software Engineer",
    department: "Engineering",
    joiningDate: "January 15, 2022",
    workLocation: "New York Office",
  },
  personalDetails: {
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    currentAddress: "123 Main Street, Apt 4B, New York, NY 10001",
    permanentAddress: "456 Oak Avenue, Springfield, IL 62704",
    dateOfBirth: "October 25, 1990",
    gender: "Female",
    bloodGroup: "O+",
    emergencyContact: {
      name: "John Doe",
      relation: "Father",
      number: "+1 (555) 987-6543",
    },
  },
  workInfo: {
    reportingManager: "Michael Smith",
    workMode: "Hybrid",
    shiftTiming: "9:00 AM - 6:00 PM",
    employmentType: "Full-time",
    employeeStatus: "Active",
  },
  documents: [
    { name: "PAN Card", status: "Verified" },
    { name: "Aadhar Card", status: "Verified" },
    { name: "Passport", status: "Pending" },
    { name: "Resume", status: "Verified" },
  ],
  leaveSnapshot: {
    casual: 5,
    sick: 3,
    earned: 10,
  },
  attendanceSummary: {
    present: 20,
    absent: 2,
    late: 3,
    wfh: 5,
  },
  skills: {
    education: ["B.S. in Computer Science - University of Tech"],
    certifications: ["AWS Certified Developer", "Certified ScrumMaster"],
    competencies: ["React.js", "Node.js", "JavaScript", "Python", "Cloud Computing"],
  },
  otherSections: {
    tenure: "2 Years, 10 Months with Company",
    awards: ["Employee of the Quarter - Q3 2023"],
    assignedProjects: [
      { name: "Project Alpha", status: "In Progress" },
      { name: "Project Beta", status: "Completed" },
    ],
  },
};

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPersonalDetails, setEditedPersonalDetails] = useState(profileData.personalDetails);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPersonalDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real application, you would send this data to an API
    console.log("Saving changes:", editedPersonalDetails);
    setIsEditing(false);
  };

  const renderSection = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <User size={20} className="text-indigo-500" />
                <span>Personal Details</span>
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Edit size={16} />
                <span>{isEditing ? "Cancel" : "Edit"}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedPersonalDetails.email}
                    onChange={handleEditChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{profileData.personalDetails.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedPersonalDetails.phone}
                    onChange={handleEditChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{profileData.personalDetails.phone}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p className="font-medium text-gray-800">{profileData.personalDetails.dateOfBirth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="font-medium text-gray-800">{profileData.personalDetails.gender}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Blood Group</p>
                <p className="font-medium text-gray-800">{profileData.personalDetails.bloodGroup}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Current Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="currentAddress"
                    value={editedPersonalDetails.currentAddress}
                    onChange={handleEditChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{profileData.personalDetails.currentAddress}</p>
                )}
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Permanent Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="permanentAddress"
                    value={editedPersonalDetails.permanentAddress}
                    onChange={handleEditChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{profileData.personalDetails.permanentAddress}</p>
                )}
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                <p className="font-medium text-gray-800">
                  {profileData.personalDetails.emergencyContact.name} ({profileData.personalDetails.emergencyContact.relation}) - {profileData.personalDetails.emergencyContact.number}
                </p>
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        );
      case "work":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Briefcase size={20} className="text-indigo-500" />
              <span>Work Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Reporting Manager</p>
                <p className="font-medium text-gray-800">{profileData.workInfo.reportingManager}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Work Mode</p>
                <p className="font-medium text-gray-800">{profileData.workInfo.workMode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Shift Timing</p>
                <p className="font-medium text-gray-800">{profileData.workInfo.shiftTiming}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Employment Type</p>
                <p className="font-medium text-gray-800">{profileData.workInfo.employmentType}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Employee Status</p>
                <p className="font-medium text-gray-800">{profileData.workInfo.employeeStatus}</p>
              </div>
            </div>
          </div>
        );
      case "documents":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <FileText size={20} className="text-indigo-500" />
              <span>Documents</span>
            </h3>
            <div className="space-y-4">
              {profileData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-800 font-medium">{doc.name}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.status === "Verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">
              <Upload size={20} />
              <span>Upload Missing Documents</span>
            </button>
          </div>
        );
      case "skills":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Book size={20} className="text-indigo-500" />
              <span>Skills & Qualifications</span>
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Education</p>
                <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium pl-4">
                  {profileData.skills.education.map((edu, index) => (
                    <li key={index}>{edu}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Professional Certifications</p>
                <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium pl-4">
                  {profileData.skills.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Skills / Competencies</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.skills.competencies.map((skill, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-600">View and edit your personal details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column - Profile Summary & Snapshots */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center text-center">
            <img
              src={profileData.basicInfo.photoUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-200 shadow-md"
            />
            <h2 className="text-2xl font-bold text-gray-900 mt-4">{profileData.basicInfo.name}</h2>
            <p className="text-gray-600 font-medium mt-1">{profileData.basicInfo.designation}</p>
            <p className="text-sm text-gray-500 mt-1">
              {profileData.basicInfo.department} | ID: {profileData.basicInfo.employeeId}
            </p>
            <div className="flex items-center space-x-2 mt-4 text-gray-600">
              <CalendarDays size={18} />
              <span className="text-sm">Joined {profileData.basicInfo.joiningDate}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2 text-gray-600">
              <MapPin size={18} />
              <span className="text-sm">{profileData.basicInfo.workLocation}</span>
            </div>
          </section>

          {/* Leave & Attendance Snapshot */}
          <section className="bg-white p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <ClipboardCheck size={20} className="text-indigo-500" />
              <span>Snapshot</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold text-indigo-600">{profileData.leaveSnapshot.casual}</p>
                <p className="text-sm text-gray-500">Casual Leaves</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold text-green-600">{profileData.leaveSnapshot.sick}</p>
                <p className="text-sm text-gray-500">Sick Leaves</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold text-red-600">{profileData.attendanceSummary.absent}</p>
                <p className="text-sm text-gray-500">Days Absent</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-2xl font-bold text-orange-600">{profileData.attendanceSummary.present}</p>
                <p className="text-sm text-gray-500">Days Present</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Tabs for detailed information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-2 rounded-xl shadow-sm flex space-x-1">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 text-center py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === "personal" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setActiveTab("work")}
              className={`flex-1 text-center py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === "work" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Work
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`flex-1 text-center py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === "documents" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex-1 text-center py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                activeTab === "skills" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Skills
            </button>
          </div>

          <section className="bg-white p-6 rounded-3xl shadow-lg">
            {renderSection()}
          </section>

          {/* Other Sections (non-tabbed) */}
          <section className="bg-white p-6 rounded-3xl shadow-lg space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Award size={20} className="text-indigo-500" />
              <span>Achievements & Projects</span>
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Tenure</p>
                <p className="font-medium text-gray-800">{profileData.otherSections.tenure}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Awards</p>
                <ul className="list-disc list-inside space-y-1 text-gray-800 font-medium pl-4">
                  {profileData.otherSections.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned Projects</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {profileData.otherSections.assignedProjects.map((project, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-800">{project.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Status: {project.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
