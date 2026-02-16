import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Loader2,
    DollarSign,
    Users,
    School,
    ExternalLink,
    LogOut,
    Eye,
    RefreshCw,
    Download,
    Trash2,
    FileSpreadsheet
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    
    // Data States
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null); // Used for both verify and delete loading states
    const [refreshKey, setRefreshKey] = useState(0);

    // UI States
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all"); // all, kare, external
    const [filterStatus, setFilterStatus] = useState("all"); // all, verified, pending
    const [selectedImage, setSelectedImage] = useState(null);

    // --- Authentication ---
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "KARE-Sparkz2K26") { 
            setIsAuthenticated(true);
            localStorage.setItem("admin_auth", "true");
            toast.success("Welcome, Admin");
        } else {
            toast.error("Invalid Password");
        }
    };

    useEffect(() => {
        const auth = localStorage.getItem("admin_auth");
        if (auth === "true") setIsAuthenticated(true);
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("admin_auth");
        toast.success("Logged out");
    };

    // --- Data Fetching ---
    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated, refreshKey]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/admin/users`);
            setUsers(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to connect to database");
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---
    
    // 1. Verify User (FIXED LOGIC)
    const verifyUser = async (id) => {
        setProcessingId(id);
        try {
            // Call API
            const response = await axios.post(`${API}/user/verify/${id}`);
            
            // Check for success (200 OK)
            if (response.status === 200 || response.status === 201) {
                // Update Local State Immediately (Optimistic Update)
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user._id === id ? { ...user, verified: true } : user
                    )
                );
                toast.success("User Verified Successfully!");
            }
        } catch (err) {
            console.error("Verification Error:", err);
            // Even if API fails, if it returns a specific error message, show it
            const msg = err.response?.data?.message || "Verification Failed. Check Console.";
            toast.error(msg);
        } finally {
            setProcessingId(null);
        }
    };

    // 2. Delete User (NEW FEATURE)
    const deleteUser = async (id, name) => {
        if (!confirm(`Are you sure you want to PERMANENTLY DELETE ${name}? This cannot be undone.`)) return;

        setProcessingId(id);
        try {
            // Assuming your backend has a delete endpoint. If not, you need to create one.
            // If no endpoint exists, this will fail. 
            // Example endpoint: axios.delete(`${API}/admin/users/${id}`)
            // For now, I'll assume standard REST:
            await axios.delete(`${API}/user/delete/${id}`); 

            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            toast.success("User Deleted");
        } catch (err) {
            console.error("Delete Error:", err);
            toast.error("Delete failed or endpoint missing");
        } finally {
            setProcessingId(null);
        }
    };

    // 3. Export to CSV (NEW FEATURE)
    const exportToCSV = () => {
        if (filteredUsers.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["Name", "Email", "Type", "College", "Phone", "Total Paid", "Status", "Transaction ID", "Events", "ProShow", "Stay"];
        
        const csvRows = [
            headers.join(','), // Header row
            ...filteredUsers.map(user => {
                const isKare = user.email?.includes("@klu.ac.in");
                const events = user.events?.map(e => e.title).join("; ") || "None";
                
                return [
                    `"${user.name}"`,
                    `"${user.email}"`,
                    isKare ? "KARE" : "External",
                    `"${user.collage || 'N/A'}"`,
                    `"${user.phone || 'N/A'}"`,
                    user.totalAmount || 0,
                    user.verified ? "Verified" : "Pending",
                    `"${user.transactionId || 'N/A'}"`,
                    `"${events}"`,
                    user.proshow ? "Yes" : "No",
                    user.accommodation ? "Yes" : "No"
                ].join(',');
            })
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sparkz_Users_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Export Downloaded");
    };

    // --- Filtering Logic ---
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = 
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());

            const isKare = user.email?.toLowerCase().endsWith("@klu.ac.in");
            const matchesType = 
                filterType === "all" ? true :
                filterType === "kare" ? isKare :
                !isKare;

            const matchesStatus = 
                filterStatus === "all" ? true :
                filterStatus === "verified" ? user.verified :
                !user.verified;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [users, searchQuery, filterType, filterStatus]);

    // --- Statistics Logic ---
    const stats = useMemo(() => {
        const totalUsers = users.length;
        const totalRevenue = users.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        const pending = users.filter(u => !u.verified).length;
        const verified = users.filter(u => u.verified).length;
        return { totalUsers, totalRevenue, pending, verified };
    }, [users]);


    // --- RENDER: LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#220000_0%,#000_100%)]" />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 w-full max-w-md bg-[#111] border border-red-900/30 p-8 rounded-2xl shadow-2xl backdrop-blur-xl"
                >
                    <div className="flex justify-center mb-6">
                         <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)]">A</div>
                    </div>
                    <h1 className="text-3xl font-black text-center text-white mb-2 uppercase tracking-tight">Admin Access</h1>
                    <p className="text-center text-gray-500 mb-8 text-sm">Secure Gateway for Sparkz 2K26</p>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Security Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors text-center font-mono tracking-widest"
                        />
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-wider text-sm"
                        >
                            Unlock Dashboard
                        </button>
                    </form>
                </motion.div>
                <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff' }}} />
            </div>
        );
    }

    // --- RENDER: DASHBOARD ---
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500 selection:text-white">
            <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}} />

            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center font-black text-lg">S</div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold uppercase tracking-wide">Admin Console</h1>
                            <p className="text-[10px] text-gray-500 font-mono tracking-widest">SPARKZ 2K26 DATABASE</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => setRefreshKey(p => p+1)} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">
                            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all text-xs font-bold uppercase">
                            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12">
                
                {/* ANALYTICS CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                    <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" />
                    <StatCard label="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="text-green-500" bg="bg-green-500/10" border="border-green-500/20" />
                    <StatCard label="Verified" value={stats.verified} icon={CheckCircle} color="text-amber-500" bg="bg-amber-500/10" border="border-amber-500/20" />
                    <StatCard label="Pending" value={stats.pending} icon={Loader2} color="text-red-500" bg="bg-red-500/10" border="border-red-500/20" />
                </div>

                {/* FILTERS & SEARCH - Responsive Stack */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4 justify-between items-center sticky top-20 z-30 shadow-2xl">
                    
                    {/* Search Bar */}
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Name, Email, Txn ID..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                            <FilterButton label="All" active={filterType === 'all'} onClick={() => setFilterType('all')} />
                            <FilterButton label="KARE" active={filterType === 'kare'} onClick={() => setFilterType('kare')} />
                            <FilterButton label="External" active={filterType === 'external'} onClick={() => setFilterType('external')} />
                        </div>
                        
                        <div className="flex gap-2 w-full sm:w-auto">
                            <select 
                                value={filterStatus} 
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="flex-1 sm:flex-none bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-300 focus:border-amber-500 outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="verified">Verified</option>
                                <option value="pending">Pending</option>
                            </select>

                            <button 
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-900/20 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 rounded-xl transition-all text-xs font-bold uppercase"
                                title="Export to CSV"
                            >
                                <FileSpreadsheet size={16} /> <span className="hidden sm:inline">Export</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* USER LIST */}
                {loading && users.length === 0 ? (
                    <div className="text-center py-20">
                        <Loader2 className="animate-spin w-12 h-12 text-amber-500 mx-auto mb-4" />
                        <p className="text-gray-500 uppercase tracking-widest text-xs">Fetching Database...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600"><Users size={32} /></div>
                        <h3 className="text-xl font-bold text-gray-300">No Users Found</h3>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <UserCard 
                                key={user._id} 
                                user={user} 
                                onVerify={() => verifyUser(user._id)}
                                onDelete={() => deleteUser(user._id, user.name)}
                                isProcessing={processingId === user._id}
                                onImageClick={setSelectedImage}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* IMAGE LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                        <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center">
                            <button className="absolute top-4 right-4 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all z-50">
                                <LogOut size={24} />
                            </button>
                            <img src={selectedImage} alt="Proof" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
                            <a 
                                href={selectedImage} 
                                download 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-6 flex items-center gap-2 px-6 py-3 bg-amber-600 text-black font-bold rounded-full hover:bg-amber-500 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Download size={18} /> Download Original
                            </a>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color, bg, border }) => (
    <div className={`bg-[#111] border ${border} p-4 md:p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-xl ${bg} ${color}`}>
                <Icon size={18} />
            </div>
        </div>
        <div>
            <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">{value}</h3>
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mt-1">{label}</p>
        </div>
    </div>
);

const FilterButton = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 sm:flex-none
            ${active ? 'bg-amber-600 text-black shadow-lg shadow-amber-900/40' : 'bg-black border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'}
        `}
    >
        {label}
    </button>
);

const UserCard = ({ user, onVerify, onDelete, isProcessing, onImageClick }) => {
    const isKare = user.email?.includes("@klu.ac.in");
    
    return (
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all group shadow-lg flex flex-col">
            {/* CARD HEADER */}
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[#151515] to-transparent flex justify-between items-start">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-lg font-bold border ${isKare ? 'bg-red-900/20 text-red-500 border-red-500/20' : 'bg-blue-900/20 text-blue-500 border-blue-500/20'}`}>
                        {user.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-white text-base leading-tight truncate">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isKare ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {isKare ? 'KARE' : 'EXTERNAL'}
                            </span>
                        </div>
                    </div>
                </div>
                {user.verified ? (
                    <div className="bg-green-500/10 p-1.5 rounded-full border border-green-500/20 shrink-0">
                        <CheckCircle size={16} className="text-green-500" />
                    </div>
                ) : (
                    <button onClick={onDelete} disabled={isProcessing} className="p-1.5 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors shrink-0">
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            {/* CARD BODY */}
            <div className="p-4 space-y-4 flex-1">
                
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 overflow-hidden">
                        <span className="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Contact</span>
                        <span className="text-gray-300 truncate block font-mono" title={user.email}>{user.email}</span>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                        <span className="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Total Paid</span>
                        <span className="text-amber-500 font-black block">₹{user.totalAmount || 0}</span>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    {user.proshow && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] uppercase font-bold">
                            Pro Show
                        </span>
                    )}
                    {user.accommodation && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold">
                            Stay
                        </span>
                    )}
                    {user.events?.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300 text-[10px] uppercase font-bold">
                            {user.events.length} Events
                        </span>
                    )}
                </div>

                {/* Event Names List (Scrollable if too long) */}
                 {user.events?.length > 0 && (
                    <div className="text-[10px] text-gray-500 leading-relaxed bg-black/20 p-2 rounded border border-white/5 max-h-20 overflow-y-auto custom-scrollbar">
                        <strong className="text-gray-400">Events:</strong> {user.events.map(e => e.title).join(", ")}
                    </div>
                )}

                {/* Payment Proof Section - Only for External/Paid */}
                {!isKare && user.paymentScreenshot ? (
                    <div className="relative group rounded-lg overflow-hidden h-24 border border-white/10 bg-black cursor-pointer mt-auto" onClick={() => onImageClick(user.paymentScreenshot)}>
                        <img src={user.paymentScreenshot} alt="Proof" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                            <Eye size={16} className="text-white" />
                            <span className="text-[10px] font-bold text-white uppercase">View Receipt</span>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-gray-400 truncate max-w-full">
                            ID: {user.transactionId}
                        </div>
                    </div>
                ) : (
                    // Spacer for alignment if no image
                    !isKare && <div className="h-24 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center text-[10px] text-gray-600 uppercase font-bold">No Image Uploaded</div>
                )}
            </div>

            {/* CARD FOOTER */}
            <div className="p-4 bg-[#080808] border-t border-white/5">
                <button
                    onClick={onVerify}
                    disabled={user.verified || isProcessing}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all
                        ${user.verified 
                            ? 'bg-green-500/10 text-green-500 cursor-default border border-green-500/20' 
                            : 'bg-gradient-to-r from-red-600 to-amber-600 text-white hover:shadow-lg hover:shadow-red-900/20 active:scale-95'
                        }
                    `}
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={14} /> Processing...</span>
                    ) : user.verified ? (
                        <span className="flex items-center justify-center gap-2"><CheckCircle size={14} /> Verified</span>
                    ) : (
                        "Verify Payment"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AdminPage;