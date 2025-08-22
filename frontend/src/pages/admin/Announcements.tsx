import { useState, FC, ChangeEvent, MouseEvent } from "react";
import {
    Megaphone,
    Calendar,
    Users,
    Gift,
    AlertTriangle,
    PlusCircle,
    Trash2,
    X,
} from "lucide-react";

// --- Data Structures ---
type Announcement = {
    id: number;
    title: string;
    category: string;
    content: string;
};

// Define the available categories and their icons
const announcementCategories = [
    { title: "Company News & Updates", icon: Megaphone, iconColor: "text-blue-500" },
    { title: "Upcoming Events", icon: Calendar, iconColor: "text-green-500" },
    { title: "HR & Employee Related Notices", icon: Users, iconColor: "text-purple-500" },
    { title: "Recognition & Appreciation", icon: Gift, iconColor: "text-amber-500" },
    { title: "Urgent Alerts", icon: AlertTriangle, iconColor: "text-red-500" },
];

// Initial data for announcements
const initialAnnouncements: Announcement[] = [
    { id: 1, title: "New Office Policies", category: "Company News & Updates", content: "New policies regarding remote work and office hours have been released." },
    { id: 2, title: "Team Outing Next Friday", category: "Upcoming Events", content: "Join us for a team outing at the park next Friday! Details in the calendar invite." },
    { id: 3, title: "Q3 Salary Credit Date", category: "HR & Employee Related Notices", content: "Salaries for the third quarter will be credited on the 25th of this month." },
    { id: 4, title: "Employee of the Quarter: Jane Doe", category: "Recognition & Appreciation", content: "Congratulations to Jane Doe for being named Employee of the Quarter!" },
    { id: 5, title: "Urgent: Server Maintenance", category: "Urgent Alerts", content: "The main server will be down for scheduled maintenance tonight from 10 PM to 1 AM." },
    { id: 6, title: "New Branch Opening in Boston", category: "Company News & Updates", content: "We are excited to announce the opening of our new branch office in Boston!" },
    { id: 7, title: "Annual Holiday Party", category: "Upcoming Events", content: "Our annual holiday party will be held on December 15th. More details to come." },
];

// --- Add Announcement Modal Component ---
interface AddAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (announcement: Omit<Announcement, "id">) => void;
}

const AddAnnouncementModal: FC<AddAnnouncementModalProps> = ({ isOpen, onClose, onSave }) => {
    const [newAnnouncement, setNewAnnouncement] = useState<Omit<Announcement, "id">>({
        title: "",
        category: announcementCategories[0].title,
        content: "",
    });

    if (!isOpen) return null;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAnnouncement(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (newAnnouncement.title && newAnnouncement.content) {
            onSave(newAnnouncement);
            setNewAnnouncement({ title: "", category: announcementCategories[0].title, content: "" });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform scale-95 animate-scale-in">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Create New Announcement</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200" aria-label="Close modal">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newAnnouncement.title}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="e.g., Important HR Update"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1" htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={newAnnouncement.category}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                            {announcementCategories.map(cat => (
                                <option key={cat.title} value={cat.title}>{cat.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1" htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={newAnnouncement.content}
                            onChange={handleChange}
                            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Write the full announcement here..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors duration-200">Cancel</button>
                        <button type="submit" onClick={handleSave} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md flex items-center justify-center gap-2">
                            <PlusCircle size={18} /> Add Announcement
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Main Announcements Component ---
export const Announcements: FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveAnnouncement = (newAnn: Omit<Announcement, "id">) => {
        const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
        setAnnouncements(prev => [{ ...newAnn, id: newId }, ...prev]);
    };

    const handleDeleteAnnouncement = (id: number) => {
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    };

    // Group announcements by category for rendering
    const groupedAnnouncements = announcements.reduce((acc, current) => {
        if (!acc[current.category]) {
            acc[current.category] = [];
        }
        acc[current.category].push(current);
        return acc;
    }, {} as Record<string, Announcement[]>);

    return (
        <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
            {/* Header Section */}
            <header className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
                        Company Announcements
                    </h1>
                    <p className="text-base sm:text-lg text-gray-500">
                        Stay up-to-date with the latest news and information.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                >
                    <PlusCircle size={20} />
                    Create New
                </button>
            </header>

            {/* Announcements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {announcementCategories.map(category => (
                    <div
                        key={category.title}
                        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 transition-transform hover:scale-[1.02] duration-300"
                    >
                        {/* Card Header with Icon */}
                        <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                            <div className="p-2 rounded-full bg-gray-100">
                                <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800 ml-3">{category.title}</h2>
                        </div>
                        {/* List of Announcements */}
                        <ul className="space-y-4 text-gray-700">
                            {groupedAnnouncements[category.title]?.length > 0 ? (
                                groupedAnnouncements[category.title].map(announcement => (
                                    <li key={announcement.id} className="relative group">
                                        <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-sm font-semibold text-gray-800 leading-tight pr-8">
                                                    {announcement.title}
                                                </h3>
                                                <button
                                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                    className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                                    title="Delete Announcement"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{announcement.content}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-400 py-4">No announcements yet.</p>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Add Announcement Modal */}
            <AddAnnouncementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAnnouncement}
            />
        </main>
    );
};

export default Announcements;
