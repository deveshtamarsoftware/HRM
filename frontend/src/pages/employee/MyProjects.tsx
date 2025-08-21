import React, { useState, useEffect } from 'react';

// Mock data to simulate an API response
const mockProjects = [
  {
    id: 'proj-101',
    name: 'Website Redesign',
    client: 'Innovate Corp',
    description: 'A complete overhaul of the company\'s marketing website to improve user experience and conversion rates.',
    objectives: 'Increase website traffic by 20% and lead conversion by 15% within six months.',
    startDate: '2023-01-15',
    deadline: '2023-06-30',
    status: 'Active',
    progress: 75,
    team: [
      { id: 'emp-1', name: 'Alex Johnson', role: 'Project Manager', avatar: 'https://placehold.co/100x100/AEC9FF/000?text=AJ', email: 'alex.j@example.com', phone: '555-1234', skills: ['Leadership', 'Agile', 'Client Management'], assignedTasks: ['Finalize scope', 'Manage client communication'] },
      { id: 'emp-2', name: 'Sarah Lee', role: 'Lead Developer', avatar: 'https://placehold.co/100x100/FFB3A1/000?text=SL', email: 'sarah.l@example.com', phone: '555-5678', skills: ['React', 'Node.js', 'Database Design'], assignedTasks: ['Develop user authentication', 'Implement API endpoints'], isMe: true },
      { id: 'emp-3', name: 'Chris Evans', role: 'UI/UX Designer', avatar: 'https://placehold.co/100x100/B8F2E6/000?text=CE', email: 'chris.e@example.com', phone: '555-9012', skills: ['Figma', 'Sketch', 'User Research'], assignedTasks: ['Create wireframes', 'Design final mockups'] },
    ],
    tasks: [
      { id: 'task-1', title: 'Create wireframes', assignee: 'Chris Evans', status: 'Done', dueDate: '2023-02-10', priority: 'Medium' },
      { id: 'task-2', title: 'Develop user authentication', assignee: 'Sarah Lee', status: 'In Progress', dueDate: '2023-03-01', priority: 'High' },
      { id: 'task-3', title: 'Design final mockups', assignee: 'Chris Evans', status: 'In Progress', dueDate: '2023-03-15', priority: 'High' },
      { id: 'task-4', title: 'Implement API endpoints', assignee: 'Sarah Lee', status: 'To Do', dueDate: '2023-04-01', priority: 'High' },
    ],
    milestones: [
      { id: 'milestone-1', name: 'Discovery & Planning Complete', date: '2023-02-01' },
      { id: 'milestone-2', name: 'Design Phase Complete', date: '2023-03-31' },
      { id: 'milestone-3', name: 'Alpha Release', date: '2023-05-15' },
      { id: 'milestone-4', name: 'Final Launch', date: '2023-06-30' },
    ],
    documents: [
      { id: 'doc-1', name: 'Project SRS', type: 'PDF', url: '#', uploadedBy: 'Admin' },
      { id: 'doc-2', name: 'Design Mockups', type: 'ZIP', url: '#', uploadedBy: 'Chris Evans' },
    ],
  },
  {
    id: 'proj-102',
    name: 'Mobile App Development',
    client: 'Global Solutions',
    description: 'Building a new mobile application for both iOS and Android platforms to streamline a business process.',
    objectives: 'Launch a feature-complete, bug-free application in both app stores by the end of the year.',
    startDate: '2023-03-01',
    deadline: '2023-12-31',
    status: 'Upcoming',
    progress: 0,
    team: [
      { id: 'emp-4', name: 'Jane Doe', role: 'Project Manager', avatar: 'https://placehold.co/100x100/F0F3BD/000?text=JD', email: 'jane.d@example.com', phone: '555-4321', skills: ['Scrum', 'Stakeholder Management'] },
      { id: 'emp-2', name: 'Sarah Lee', role: 'Mobile Developer', avatar: 'https://placehold.co/100x100/FFB3A1/000?text=SL', email: 'sarah.l@example.com', phone: '555-5678', skills: ['React Native', 'Swift'], assignedTasks: ['Set up development environment', 'Implement core features'], isMe: true },
    ],
    tasks: [
      { id: 'task-5', title: 'Set up development environment', assignee: 'Sarah Lee', status: 'To Do', dueDate: '2023-03-15', priority: 'High' },
      { id: 'task-6', title: 'Implement core features', assignee: 'Sarah Lee', status: 'To Do', dueDate: '2023-05-01', priority: 'Medium' },
    ],
    milestones: [
      { id: 'milestone-5', name: 'Planning Complete', date: '2023-03-10' },
      { id: 'milestone-6', name: 'Alpha Version', date: '2023-07-30' },
      { id: 'milestone-7', name: 'Beta Version', date: '2023-10-31' },
      { id: 'milestone-8', name: 'Final Launch', date: '2023-12-31' },
    ],
    documents: [
      { id: 'doc-3', name: 'App Requirements', type: 'DOCX', url: '#', uploadedBy: 'Jane Doe' },
    ],
  },
  {
    id: 'proj-103',
    name: 'Legacy System Migration',
    client: 'Data Solutions LLC',
    description: 'Migrating an old, on-premise system to a new cloud-based infrastructure to improve performance and scalability.',
    objectives: 'Successfully migrate all data and services with zero downtime for clients.',
    startDate: '2022-11-01',
    deadline: '2023-02-28',
    status: 'Completed',
    progress: 100,
    team: [
      { id: 'emp-5', name: 'Mark Fisher', role: 'Lead Architect', avatar: 'https://placehold.co/100x100/C1C1FF/000?text=MF', email: 'mark.f@example.com', phone: '555-3333', skills: ['Cloud Computing', 'Databases'] },
      { id: 'emp-2', name: 'Sarah Lee', role: 'Data Engineer', avatar: 'https://placehold.co/100x100/FFB3A1/000?text=SL', email: 'sarah.l@example.com', phone: '555-5678', skills: ['SQL', 'ETL Processes'], assignedTasks: ['Migrate user data', 'Optimize database queries'], isMe: true },
    ],
    tasks: [
      { id: 'task-7', title: 'Migrate user data', assignee: 'Sarah Lee', status: 'Done', dueDate: '2023-01-20', priority: 'High' },
      { id: 'task-8', title: 'Optimize database queries', assignee: 'Sarah Lee', status: 'Done', dueDate: '2023-02-15', priority: 'Medium' },
    ],
    milestones: [
      { id: 'milestone-9', name: 'Data Migration Complete', date: '2023-01-31' },
      { id: 'milestone-10', name: 'System Go-Live', date: '2023-02-28' },
    ],
    documents: [
      { id: 'doc-4', name: 'Migration Plan', type: 'DOCX', url: '#', uploadedBy: 'Mark Fisher' },
    ],
  },
];

// Helper component for the status badge
const StatusBadge = ({ status }) => {
  let color = '';
  switch (status) {
    case 'Active':
      color = 'bg-green-100 text-green-800';
      break;
    case 'On Hold':
      color = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Delayed':
      color = 'bg-red-100 text-red-800';
      break;
    case 'Completed':
      color = 'bg-blue-100 text-blue-800';
      break;
    case 'Upcoming':
      color = 'bg-purple-100 text-purple-800';
      break;
    default:
      color = 'bg-gray-100 text-gray-800';
  }
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{status}</span>;
};

// Main component that orchestrates the entire app
const MyProjects = () => {
  // State for navigation
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter and search logic
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
      {!selectedProject ? (
        // Project List View
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Projects</h1>
          <p className="text-gray-600 mb-6">Track your assigned projects and tasks.</p>

          <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search for a project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto w-full md:w-auto justify-center md:justify-end">
              {['All', 'Active', 'Completed', 'On Hold', 'Upcoming'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out ${
                    filterStatus === status
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Project Table/Grid */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start–End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress %</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map(project => (
                      <tr key={project.id} className="hover:bg-gray-50 cursor-pointer transition duration-150" onClick={() => setSelectedProject(project)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.startDate} - {project.deadline}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StatusBadge status={project.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2">{project.progress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No projects found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // Project Details Page
        <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} />
      )}
    </main>
  );
};

// Component for the Project Details Page
const ProjectDetails = ({ project, onBack }) => {
  const [currentTab, setCurrentTab] = useState('Overview');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMyTasks, setShowMyTasks] = useState(false);

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'On Hold':
        return 'bg-yellow-500';
      case 'Delayed':
        return 'bg-red-500';
      case 'Completed':
        return 'bg-blue-500';
      case 'Upcoming':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const openProfileModal = (member) => {
    setSelectedMember(member);
    setShowProfileModal(true);
  };

  const filteredTasks = showMyTasks
    ? project.tasks.filter(task => task.assignee === 'Sarah Lee')
    : project.tasks;

  const renderTabContent = () => {
    switch (currentTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Project Overview</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">{project.name}</h4>
                <div className={`px-3 py-1 text-sm rounded-full text-white ${getStatusColor(project.status)}`}>
                  {project.status}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <p className="text-gray-700 font-medium">Objectives:</p>
              <p className="text-gray-600">{project.objectives}</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div><strong>Start Date:</strong> {project.startDate}</div>
                <div><strong>Deadline:</strong> {project.deadline}</div>
              </div>
              <div className="mt-6">
                <p className="text-gray-700 font-medium mb-2">Overall Progress:</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-blue-600 font-bold mt-2 inline-block">{project.progress}% Complete</span>
              </div>
            </div>
          </div>
        );
      case 'Team':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Team Members</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.team.map(member => (
                  <div key={member.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer" onClick={() => openProfileModal(member)}>
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full ring-2 ring-gray-300" />
                    <div>
                      <h4 className="font-bold text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Tasks':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Tasks & Deliverables</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4 flex justify-between items-center">
                <h4 className="text-lg font-bold">Task List</h4>
                <button
                  onClick={() => setShowMyTasks(!showMyTasks)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
                    showMyTasks ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {showMyTasks ? 'Show All Tasks' : 'Show Only My Tasks'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(task => (
                        <tr key={task.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignee}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                              task.status === 'Done' ? 'bg-green-100 text-green-800' :
                              task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              task.status === 'To Do' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.priority}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No tasks to display.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Milestones':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Milestones & Timeline</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ol className="relative border-l border-gray-200 ml-4">
                {project.milestones.map(milestone => (
                  <li key={milestone.id} className="mb-8 ml-4">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400">{milestone.date}</time>
                    <h4 className="text-lg font-semibold text-gray-900">{milestone.name}</h4>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        );
      case 'Documents':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Project Documents</h3>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ul className="space-y-4">
                {project.documents.map(doc => (
                  <li key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">Uploaded by {doc.uploadedBy}</p>
                      </div>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">Download</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center text-blue-600 hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Projects
      </button>

      {/* Project Header */}
      <header className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
          <p className="text-gray-500 mt-1">Project Code: {project.id}</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex flex-wrap gap-2">
          {['Overview', 'Team', 'Tasks', 'Milestones', 'Documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ease-in-out ${
                currentTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Mini Profile Modal */}
      {showProfileModal && selectedMember && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full m-4 relative transform transition-all ease-in-out duration-300 scale-100">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center text-center">
              <img src={selectedMember.avatar} alt={selectedMember.name} className="w-24 h-24 rounded-full ring-4 ring-blue-200 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
              <p className="text-blue-600 font-medium">{selectedMember.role}</p>
              <div className="mt-6 w-full space-y-4 text-left">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-700">{selectedMember.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.042 11.042 0 007.962 7.962l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-gray-700">{selectedMember.phone}</span>
                </div>
              </div>
              <div className="mt-6 w-full">
                <p className="font-semibold text-gray-900 mb-2">Skills/Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
              {selectedMember.assignedTasks && (
                <div className="mt-6 w-full">
                  <p className="font-semibold text-gray-900 mb-2">Assigned Tasks (in this project):</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedMember.assignedTasks.map((task, index) => (
                      <li key={index}>{task}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;
