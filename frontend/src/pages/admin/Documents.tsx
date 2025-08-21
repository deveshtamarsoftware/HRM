import { useState, FC, ChangeEvent, MouseEvent } from "react";
import {
    PlusCircle,
    Search,
    Download,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Info,
    X,
    Folder,
    Filter,
    ArrowUpFromLine,
    FileText,
    User,
    Clipboard,
    Tag,
    Clock,
    UserCheck,
    Check,
    X as XIcon,
} from "lucide-react";

// --- Data Structures ---
type DocumentStatus = "Pending Verification" | "Verified" | "Rejected" | "Expired";
type DocumentCategory = "HR" | "Personal" | "Finance" | "Training";
type DocumentType = "Resume" | "ID Proof" | "PAN Card" | "Certificate";

interface Document {
    id: number;
    employeeName: string;
    employeeId: string;
    documentName: string;
    documentType: DocumentType;
    uploadDate: string;
    category: DocumentCategory;
    status: DocumentStatus;
    isImportant: boolean;
}

// Initial data for documents
const initialDocuments: Document[] = [
    {
        id: 1,
        employeeName: "Jane Doe",
        employeeId: "E001",
        documentName: "Resume",
        documentType: "Resume",
        uploadDate: "2024-08-15 10:30 AM",
        category: "HR",
        status: "Pending Verification",
        isImportant: false,
    },
    {
        id: 2,
        employeeName: "John Smith",
        employeeId: "E002",
        documentName: "Aadhar Card",
        documentType: "ID Proof",
        uploadDate: "2024-08-14 02:45 PM",
        category: "Personal",
        status: "Verified",
        isImportant: true,
    },
    {
        id: 3,
        employeeName: "Sarah Chen",
        employeeId: "E003",
        documentName: "Project Management Certification",
        documentType: "Certificate",
        uploadDate: "2024-08-12 09:00 AM",
        category: "Training",
        status: "Pending Verification",
        isImportant: false,
    },
    {
        id: 4,
        employeeName: "Michael Brown",
        employeeId: "E004",
        documentName: "Payslip - July 2024",
        documentType: "Payslips",
        uploadDate: "2024-08-10 11:20 AM",
        category: "Finance",
        status: "Verified",
        isImportant: false,
    },
    {
        id: 5,
        employeeName: "Jane Doe",
        employeeId: "E001",
        documentName: "Driver's License",
        documentType: "ID Proof",
        uploadDate: "2024-08-08 04:10 PM",
        category: "Personal",
        status: "Expired",
        isImportant: false,
    },
];

// --- Document Detail Modal Component ---
interface DocumentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    document: Document | null;
    onUpdateStatus: (id: number, status: DocumentStatus, remarks?: string) => void;
    onDelete: (id: number) => void;
}

const DocumentDetailModal: FC<DocumentDetailModalProps> = ({ isOpen, onClose, document, onUpdateStatus, onDelete }) => {
    const [remarks, setRemarks] = useState("");

    if (!isOpen || !document) return null;

    const handleApprove = () => {
        onUpdateStatus(document.id, "Verified");
        onClose();
    };

    const handleReject = () => {
        onUpdateStatus(document.id, "Rejected", remarks);
        onClose();
    };

    const handleDelete = () => {
        onDelete(document.id);
        onClose();
    };

    const getStatusColors = (status: DocumentStatus) => {
        switch (status) {
            case "Verified":
                return "text-green-600 bg-green-100";
            case "Pending Verification":
                return "text-yellow-600 bg-yellow-100";
            case "Rejected":
                return "text-red-600 bg-red-100";
            case "Expired":
                return "text-gray-600 bg-gray-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform scale-95 animate-scale-in">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Document Details</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-200" aria-label="Close modal">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={20} />
                        {document.documentName}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <p>
                            <span className="font-semibold text-gray-700">Employee:</span> {document.employeeName} ({document.employeeId})
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">Type:</span> {document.documentType}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">Category:</span> {document.category}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">Upload Date:</span> {document.uploadDate}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColors(document.status)}`}>
                                {document.status}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">Important:</span> {document.isImportant ? "Yes" : "No"}
                        </p>
                    </div>

                    <div className="pt-4">
                        <label className="block text-gray-700 font-semibold mb-1" htmlFor="remarks">
                            Remarks for Rejection (Optional)
                        </label>
                        <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="Add notes or reasons for rejection..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-6 border-gray-100">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 border border-red-300 font-semibold hover:bg-red-50 transition-colors duration-200"
                    >
                        <Trash2 size={18} /> Delete
                    </button>
                    {document.status === "Pending Verification" && (
                        <>
                            <button
                                onClick={handleReject}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors duration-200"
                            >
                                <XIcon size={18} /> Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Check size={18} /> Approve
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main Documents Component ---
export const Documents: FC = () => {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | "All">("All");
    const [selectedType, setSelectedType] = useState<DocumentType | "All">("All");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    // Filter documents based on search and selected filters
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.documentName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
        const matchesType = selectedType === "All" || doc.documentType === selectedType;

        return matchesSearch && matchesStatus && matchesType;
    });

    // Handle actions from the modal
    const handleUpdateStatus = (id: number, status: DocumentStatus) => {
        setDocuments(prevDocs =>
            prevDocs.map(doc =>
                doc.id === id ? { ...doc, status: status } : doc
            )
        );
    };

    const handleDelete = (id: number) => {
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
    };

    // Open modal with selected document
    const handlePreview = (doc: Document) => {
        setSelectedDoc(doc);
        setModalOpen(true);
    };

    // Dashboard stats
    const pendingCount = documents.filter(doc => doc.status === "Pending Verification").length;
    const verifiedCount = documents.filter(doc => doc.status === "Verified").length;
    const totalCount = documents.length;

    const getStatusChipColors = (status: DocumentStatus) => {
        switch (status) {
            case "Verified":
                return "bg-green-100 text-green-700";
            case "Pending Verification":
                return "bg-yellow-100 text-yellow-700";
            case "Rejected":
                return "bg-red-100 text-red-700";
            case "Expired":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <main className="p-6 md:ml-64 mt-20 bg-gray-100 min-h-screen font-sans">
            <header className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
                <div className="mb-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
                        Documents
                    </h1>
                    <p className="text-base sm:text-lg text-gray-500">
                        Manage employee documents, contracts, and certifications.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm font-medium">
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md">
                        <Info className="w-6 h-6 text-blue-500 mr-3" />
                        <div>
                            <p className="text-gray-500">Total Documents</p>
                            <p className="text-blue-600 text-xl font-bold">{totalCount}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-yellow-50 rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md">
                        <Clock className="w-6 h-6 text-yellow-500 mr-3" />
                        <div>
                            <p className="text-gray-500">Pending for Review</p>
                            <p className="text-yellow-600 text-xl font-bold">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="flex items-center p-4 bg-green-50 rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02] hover:shadow-md">
                        <UserCheck className="w-6 h-6 text-green-500 mr-3" />
                        <div>
                            <p className="text-gray-500">Verified Documents</p>
                            <p className="text-green-600 text-xl font-bold">{verifiedCount}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center w-full md:w-1/2 relative">
                        <Search className="absolute left-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or document..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-1/2">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as DocumentStatus | "All")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending Verification">Pending</option>
                            <option value="Verified">Verified</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Expired">Expired</option>
                        </select>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as DocumentType | "All")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        >
                            <option value="All">All Types</option>
                            <option value="Resume">Resume</option>
                            <option value="ID Proof">ID Proof</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Certificate">Certificate</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Document Table */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center"><User size={14} className="mr-1" /> Employee</span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center"><FileText size={14} className="mr-1" /> Document</span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center"><ArrowUpFromLine size={14} className="mr-1" /> Upload Date</span>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <span className="flex items-center"><Tag size={14} className="mr-1" /> Status</span>
                                </th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDocuments.length > 0 ? (
                                filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-100 transition-all duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900">{doc.employeeName}</div>
                                                <div className="text-xs text-gray-500">{doc.employeeId}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="text-sm font-medium text-gray-900">{doc.documentName}</div>
                                                <div className="text-xs text-gray-500">{doc.documentType}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {doc.uploadDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipColors(doc.status)}`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => handlePreview(doc)}
                                                    className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                                    title="Preview"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <a
                                                    href="#"
                                                    download
                                                    className="p-2 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                                                    title="Download"
                                                >
                                                    <Download size={18} />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No documents found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Document Detail Modal */}
            <DocumentDetailModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                document={selectedDoc}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
            />
        </main>
    );
};

export default Documents;
