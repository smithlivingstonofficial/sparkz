
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPage = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('normal'); // 'normal' or 'proshow'
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // For Image Modal
    const [isLoadingData, setIsLoadingData] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6500';

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const endpoint = activeTab === 'normal' ? '/admin/normal' : '/admin/proshow';
                const res = await fetch(`${API_URL}${endpoint}`);
                const jsonData = await res.json();
                // Sort by date descending if possible, or reverse
                setData(jsonData.reverse());
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [activeTab]);

    // Filter Data based on Search
    const filteredData = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const name = (item.name || item.user?.name || '').toLowerCase();
        const email = (item.email || item.user?.email || '').toLowerCase();
        const phone = (item.phone || item.user?.phone || '').toLowerCase();
        const txnId = (item.transactionId || '').toLowerCase();
        const eventName = (activeTab === 'normal' ? (Array.isArray(item.event) ? item.event.map(e => e.title).join(", ") : item.event?.name) : item.type).toLowerCase();

        return name.includes(searchLower) ||
            email.includes(searchLower) ||
            phone.includes(searchLower) ||
            txnId.includes(searchLower) ||
            eventName.includes(searchLower);
    });

    if (loading) return <div className="text-white">Loading...</div>;

    // In a real app, check for admin role here. 
    // if (!user || user.role !== 'admin') return <Navigate to="/" />;

    return (
        <div className="min-h-screen pt-24 px-6 bg-black text-white">
            <h1 className="text-4xl font-bold font-['Cinzel'] text-amber-500 mb-8">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('normal')}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'normal' ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/60 hover:text-white'}`}
                >
                    Normal Events
                </button>
                <button
                    onClick={() => setActiveTab('proshow')}
                    className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'proshow' ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/60 hover:text-white'}`}
                >
                    Proshows
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by Name, Email, Phone, Transaction ID, or Event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/10">
                {isLoadingData ? (
                    <div className="p-8 text-center text-white/60">Loading data...</div>
                ) : filteredData.length === 0 ? (
                    <div className="p-8 text-center text-white/60">No records found.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 font-semibold text-amber-500">User Details</th>
                                <th className="p-4 font-semibold text-amber-500">Event Info</th>
                                <th className="p-4 font-semibold text-amber-500">Payment Details</th>
                                <th className="p-4 font-semibold text-amber-500">Screenshot</th>
                                <th className="p-4 font-semibold text-amber-500">Date Logged</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 align-top">
                                        <div className="font-bold text-white">{item.name || item.user?.name || 'N/A'}</div>
                                        <div className="text-xs text-white/60">{item.email || item.user?.email}</div>
                                        <div className="text-xs text-white/60">{item.phone || item.user?.phone}</div>
                                        <div className="text-xs text-amber-500/80 mt-1">{item.college || item.user?.college}</div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className={`px-2 py-1 rounded text-xs border ${activeTab === 'normal' ? 'bg-blue-900/40 text-blue-300 border-blue-500/20' : 'bg-amber-900/40 text-amber-300 border-amber-500/20'}`}>
                                            {activeTab === 'normal'
                                                ? (Array.isArray(item.event)
                                                    ? item.event.map(e => e.title).join(", ")
                                                    : item.event?.name || 'Event')
                                                : (item.type || 'Proshow')}
                                        </span>
                                        {activeTab === 'proshow' && <div className="text-xs text-white/50 mt-1">Price: ₹500</div>}
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="text-sm font-mono text-white/80">
                                            <span className="text-white/40">TXN:</span> {item.transactionId || 'N/A'}
                                        </div>
                                        {item.upiId && (
                                            <div className="text-xs font-mono text-white/60 mt-1">
                                                <span className="text-white/40">UPI:</span> {item.upiId}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-top">
                                        {item.paymentScreenshot ? (
                                            <button
                                                onClick={() => setSelectedImage(item.paymentScreenshot)}
                                                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                View Image
                                            </button>
                                        ) : (
                                            <span className="text-xs text-white/30">No Image</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-white/60 align-top">
                                        {item.date ? new Date(item.date).toLocaleDateString() + ' ' + new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item._id ? new Date(parseInt(item._id.substring(0, 8), 16) * 1000).toLocaleDateString() : '-')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full">
                        <button
                            className="absolute -top-10 right-0 text-white hover:text-amber-500 text-xl font-bold"
                            onClick={() => setSelectedImage(null)}
                        >
                            Close [X]
                        </button>
                        <img
                            src={selectedImage}
                            alt="Payment Proof"
                            className="w-full h-full object-contain rounded-lg shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
