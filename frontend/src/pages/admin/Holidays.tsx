import { useState, FC, ChangeEvent, FormEvent } from "react";
import {CalendarDays}   from "lucide-react";

// Define a type for a company holiday
export type Holiday = {
    id: number;
    name: string;
    date: string;
};

const initialHolidays: Holiday[] = [
    { id: 1, name: "Independence Day", date: "2024-08-15" },
    { id: 2, name: "Labor Day", date: "2024-09-02" },
    { id: 3, name: "Diwali", date: "2024-11-01" },
];

const Holidays = () => {
    // State to manage the list of holidays
    const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
    // State to manage the new holiday form data
    const [newHoliday, setNewHoliday] = useState<Omit<Holiday, "id">>({ name: "", date: "" });
    // State to toggle the visibility of the add holiday form
    const [showAddHolidayForm, setShowAddHolidayForm] = useState(false);

    // Handle changes in the form inputs
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewHoliday(prev => ({ ...prev, [name]: value }));
    };

    // Handle adding a new holiday to the list
    const handleAddHoliday = (e: FormEvent) => {
        e.preventDefault();
        if (newHoliday.name && newHoliday.date) {
            // Create a unique ID for the new holiday
            const newId = holidays.length > 0 ? Math.max(...holidays.map(h => h.id)) + 1 : 1;
            setHolidays(prev => [...prev, { id: newId, ...newHoliday }]);
            // Reset the form and hide it
            setNewHoliday({ name: "", date: "" });
            setShowAddHolidayForm(false);
        }
    };

    return (
        
       <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
                        <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-gray-200">
                        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                            Company Holidays 🎉
                        </h1>
                        <button
                            onClick={() => setShowAddHolidayForm(!showAddHolidayForm)}
                            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
                        >
                            {showAddHolidayForm ? "Cancel" : "Add New Holiday"}
                        </button>
                    </div>

                    {/* Form to add a new holiday */}
                    {showAddHolidayForm && (
                        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-200 animate-slide-down">
                            <form onSubmit={handleAddHoliday} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                                <div className="col-span-1">
                                    <label htmlFor="holidayName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Holiday Name
                                    </label>
                                    <input
                                        id="holidayName"
                                        name="name"
                                        type="text"
                                        value={newHoliday.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        placeholder="e.g., Christmas"
                                        required
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label htmlFor="holidayDate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        id="holidayDate"
                                        name="date"
                                        type="date"
                                        value={newHoliday.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div className="col-span-1">
                                    <button
                                        type="submit"
                                        className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-colors duration-200"
                                    >
                                        Save Holiday
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Table to display all holidays */}
                    <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold tracking-wider">
                                        <th className="px-6 py-4">Holiday Name</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {holidays.length > 0 ? (
                                        holidays.map((holiday) => (
                                            <tr key={holiday.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                                                <td className="px-6 py-4 text-gray-800 font-medium">{holiday.name}</td>
                                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{holiday.date}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-10 text-center text-gray-500 text-lg">
                                                <p>No holidays have been added yet. 🏖️</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
    );
};

export default Holidays;
