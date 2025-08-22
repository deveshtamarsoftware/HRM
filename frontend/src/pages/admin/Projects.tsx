import React, { useState } from "react";
import { X, Plus, Trash2, Users, FileText } from "lucide-react";

// This interface defines the shape of a project object.
interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  team: string[];
}

// --- MOCK DATA ---
const initialProjects: Project[] = [
  {
    id: 1,
    name: "Project Alpha",
    description: "Develop a new mobile application.",
    status: "In Progress",
    team: ["John Doe", "Sarah Chen", "Mike Johnson"],
  },
  {
    id: 2,
    name: "Project Beta",
    description: "Create a company-wide data analytics platform.",
    status: "On Hold",
    team: ["Peter Jones", "Alex Williams", "Emily Davis"],
  },
  {
    id: 3,
    name: "Project Gamma",
    description: "Design a new user interface for the HRMS system.",
    status: "Completed",
    team: ["Mary Brown", "Jane Smith", "Robert Green", "Linda White"],
  },
  {
    id: 4,
    name: "Project HRMS",
    description: "Design a new user interface for the HRMS system.",
    status: "Completed",
    team: ["Vipul Panwar", "Anand Prakash", "Sam Wilson"],
  },
];

// Projects Page Component
const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    status: "In Progress",
    team: [],
  });
  const [newMemberName, setNewMemberName] = useState<string>("");

  // Handles input changes for the new project form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    // Special handling for the team field, assuming a comma-separated string
    if (name === "team") {
      setNewProject((prev) => ({
        ...prev,
        team: value.split(",").map((member) => member.trim()),
      }));
    } else {
      setNewProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handles adding a new project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newId =
      projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
    setProjects((prev) => [...prev, { ...newProject, id: newId }]);
    setIsAddModalOpen(false);
    setNewProject({
      name: "",
      description: "",
      status: "In Progress",
      team: [],
    });
  };

  // Handles removing a project
  const handleRemoveProject = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Handles adding a team member to a selected project
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !selectedProject) return;

    const updatedProjects = projects.map((p) =>
      p.id === selectedProject.id
        ? { ...p, team: [...p.team, newMemberName] }
        : p
    );
    setProjects(updatedProjects);
    setSelectedProject((prev) =>
      prev ? { ...prev, team: [...prev.team, newMemberName] } : null
    );
    setNewMemberName(""); // Clear input after adding
  };

  // Handles removing a team member from a selected project
  const handleRemoveMember = (memberToRemove: string) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map((p) =>
      p.id === selectedProject.id
        ? { ...p, team: p.team.filter((member) => member !== memberToRemove) }
        : p
    );
    setProjects(updatedProjects);
    setSelectedProject((prev) =>
      prev
        ? {
            ...prev,
            team: prev.team.filter((member) => member !== memberToRemove),
          }
        : null
    );
  };

  return (
    <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Project Dashboard
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 animate-fade-in">
          <div className="relative p-8 bg-white w-full max-w-lg mx-4 rounded-3xl shadow-2xl transform scale-95 md:scale-100 transition-all duration-300 animate-slide-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              Create New Project
            </h3>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={28} />
            </button>
            <form onSubmit={handleAddProject} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-400"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-400"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newProject.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-400"
                >
                  <option>In Progress</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="team"
                  className="block text-sm font-medium text-gray-700"
                >
                  Team Members (comma separated)
                </label>
                <input
                  type="text"
                  id="team"
                  name="team"
                  value={newProject.team.join(", ")}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-400"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 mt-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col space-y-4 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:border-indigo-200 cursor-pointer"
          >
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {project.name}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full min-w-[90px] text-center ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : project.status === "On Hold"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{project.description}</p>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <p className="text-sm text-gray-600 font-medium flex items-center space-x-1">
                <Users size={16} className="text-gray-500" />
                <span>Team: {project.team.length} members</span>
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the parent div's onClick from firing
                    handleRemoveProject(project.id);
                  }}
                  className="p-2 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
                  title="Delete Project"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 animate-fade-in">
          <div className="relative p-8 bg-white w-full max-w-lg mx-4 rounded-3xl shadow-2xl transform scale-95 md:scale-100 transition-all duration-300 animate-slide-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              {selectedProject.name}
            </h3>
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X size={28} />
            </button>
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-2">
                  <FileText size={20} className="text-indigo-500" />
                  <span>Description</span>
                </h4>
                <p className="text-gray-600 text-sm">
                  {selectedProject.description}
                </p>
              </div>
              <div>
                <h4 className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-2">
                  <Users size={20} className="text-indigo-500" />
                  <span>Team Members</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                  {selectedProject.team.map((member, index) => (
                    <li key={index} className="flex items-center justify-between">
                      {member}
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="p-1 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove Member"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
                <form onSubmit={handleAddMember} className="mt-4">
                  <div className="flex rounded-xl overflow-hidden border border-gray-300 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="Add new team member"
                      className="flex-1 px-4 py-2 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Projects;
