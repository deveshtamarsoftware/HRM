import React, { useState, FC } from "react";
import {
    Megaphone,
    Calendar,
    Users,
    Gift,
    AlertTriangle,
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

// --- Main Announcements Component (Employee View) ---
export const Announcements: FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

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
            <header className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
                    Employee Announcements Page
                </h1>
                <p className="text-base sm:text-lg text-gray-500">
                    Stay up-to-date with the latest news and information.
                </p>
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
                                        <div className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-sm font-semibold text-gray-800 leading-tight">
                                                    {announcement.title}
                                                </h3>
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
        </main>
    );
};

export default Announcements;
