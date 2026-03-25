import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    UserPlus, Search, CheckCircle, Loader2, 
    Ticket, CreditCard, RefreshCw, Trash2, 
    ShoppingCart, LogOut, User, X, Lock, KeyRound
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// 1. Import event data directly from the JSON file
import eventsData from '../assets/data/events.json';

const API = import.meta.env.VITE_API_URL;

// Pricing Configuration
const PRICES = {
    EVENT_REGISTRATION: 300,
    PRO_SHOW: 500,
    ACCOMMODATION: 400
};

// Secret for payment confirmation
const PAYMENT_SECRET = "payment@desk";

const OnSpotPage = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Data State
    const [allUsers, setAllUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    
    // Search & Selection State
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    // Event & Cart State
    const [availableEvents, setAvailableEvents] = useState([]); 
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [addons, setAddons] = useState({ proshow: false, accommodation: false });
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [searchEvent, setSearchEvent] = useState("");
    
    // Transaction State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    // --- Authentication & Initial Load ---
    useEffect(() => {
        const auth = sessionStorage.getItem("onspot_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
        // Load events
        setAvailableEvents(eventsData);
        setLoadingEvents(false);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated]);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await axios.get(`${API}/admin/users`);
            setAllUsers(res.data || []);
        } catch (err) {
            toast.error("Failed to load users database");
            console.error(err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "KARE-Desk") { 
            setIsAuthenticated(true);
            sessionStorage.setItem("onspot_auth", "true");
            toast.success("Desk Access Granted");
        } else {
            toast.error("Invalid Desk Code");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("onspot_auth");
    };

    // --- User Search Logic ---
    const userSearchResults = useMemo(() => {
        if (!userSearchQuery || userSearchQuery.trim() === "") return [];
        const q = userSearchQuery.toLowerCase();
        
        return allUsers.filter(u => {
            const name = u.name?.toLowerCase() || "";
            const email = u.email?.toLowerCase() || "";
            const phone = u.phone?.toString() || "";
            const college = u.collage?.toLowerCase() || "";
            const regNo = (u.registerNumber || u.regNo || "").toString().toLowerCase();
            
            return name.includes(q) || 
                   email.includes(q) || 
                   phone.includes(q) || 
                   college.includes(q) ||
                   regNo.includes(q);
        }).slice(0, 5); // Show top 5 results
    }, [allUsers, userSearchQuery]);

    // --- Cart Logic ---
    const isKare = useMemo(() => {
        if (!selectedUser) return false;
        return selectedUser.email?.toLowerCase().includes("@klu.ac.in");
    }, [selectedUser]);

    const calculateTotal = () => {
        let total = 0;
        if (selectedEvents.length > 0 && !isKare) total += PRICES.EVENT_REGISTRATION;
        if (addons.proshow) total += PRICES.PRO_SHOW;
        if (addons.accommodation) total += PRICES.ACCOMMODATION;
        return total;
    };

    const handleEventToggle = (event) => {
        if (!selectedUser) return toast.error("Please search and select a user first");
        
        if (selectedEvents.find(e => e.id === event.id)) {
            setSelectedEvents(prev => prev.filter(e => e.id !== event.id));
        } else {
            setSelectedEvents(prev => [...prev, event]);
        }
    };

    const handleReset = () => {
        setSelectedUser(null);
        setUserSearchQuery("");
        setSelectedEvents([]);
        setAddons({ proshow: false, accommodation: false });
        setShowPaymentModal(false);
        setConfirmPassword("");
        toast.success("System Ready");
    };

    const initiatePayment = () => {
        if (!selectedUser) return toast.error("Select a user first");
        if (selectedEvents.length === 0 && !addons.proshow && !addons.accommodation) return toast.error("Cart is empty");
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async (e) => {
        e.preventDefault();
        
        if (!confirmPassword) return toast.error("Enter confirmation password");
        if (confirmPassword !== PAYMENT_SECRET) {
             return toast.error("Invalid Payment Password");
        }

        setIsSubmitting(true);
        try {
            const bookingPayload = {
                user: selectedUser, 
                event: selectedEvents,
                proshow: addons.proshow,
                accommodation: addons.accommodation,
                transactionId: `SPOT-${Date.now()}`,
                upiId: "CASH-ON-HAND",
                totalAmount: calculateTotal(),
                paymentScreenshot: "https://placehold.co/600x400/000000/FFF?text=OnSpot+Verified" 
            };
            
            await axios.post(`${API}/user/event/onspot`, bookingPayload);

            toast.success( `Payment Collected - User Verified!`, { duration: 4000 });
            handleReset();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Booking Failed");
        } finally {
            setIsSubmitting(false);
            setShowPaymentModal(false);
        }
    };

    // --- Render Login ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-[#111] border border-amber-900/30 p-8 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-black text-center text-amber-500 mb-2">Registration Desk</h1>
                    <p className="text-center text-gray-500 mb-8 text-sm">On-Spot Entry Portal</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input type="password" placeholder="Access Code" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none text-center tracking-widest" />
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-3.5 rounded-xl transition-all">ENTER CONSOLE</button>
                    </form>
                </div>
                <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff' }}} />
            </div>
        );
    }

    const filteredEvents = availableEvents.filter(e => e.title.toLowerCase().includes(searchEvent.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500 selection:text-black">
            <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}} />

            {/* Header */}
            <header className="fixed top-0 inset-x-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center font-black text-black text-lg">R</div>
                    <div>
                        <h1 className="text-lg font-bold uppercase">On-Spot Desk</h1>
                        <p className="text-[10px] text-green-500 font-mono flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> LIVE SYSTEM</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="text-right hidden md:block">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Loaded Users</p>
                        <p className="text-white font-mono">{allUsers.length}</p>
                    </div>
                    <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"><LogOut size={20}/></button>
                </div>
            </header>

            <main className="pt-24 pb-12 px-4 md:px-6 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-6 h-screen">
                
                {/* LEFT: User Search & Selection (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-20">
                    
                    {/* SEARCH BOX / SELECTED USER CARD */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 relative">
                        {!selectedUser ? (
                            <>
                                <h2 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2"><Search size={20}/> Find Attendee</h2>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input 
                                            autoFocus
                                            value={userSearchQuery}
                                            onChange={(e) => setUserSearchQuery(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-11 focus:border-amber-500 outline-none transition-colors" 
                                            placeholder="Search Name, Email, Phone..." 
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                                    </div>

                                    {/* Search Results Dropdown */}
                                    {userSearchQuery && (
                                        <div className="flex flex-col gap-2 mt-2">
                                            {loadingUsers ? (
                                                <div className="p-4 text-center"><Loader2 className="animate-spin inline"/></div>
                                            ) : userSearchResults.length > 0 ? (
                                                userSearchResults.map(user => (
                                                    <button
                                                        key={user._id}
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setUserSearchQuery("");
                                                        }}
                                                        className="flex items-center gap-3 p-3 rounded-lg bg-black/50 hover:bg-white/5 border border-white/5 text-left transition-all"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-200 truncate">{user.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-xs text-center text-gray-500 py-2">No users found</p>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-gray-600 text-center pt-2">Database synced with Online Registrations</p>
                                </div>
                            </>
                        ) : (
                            // SELECTED USER CARD
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-bold text-green-500 flex items-center gap-2"><User size={20}/> Selected User</h2>
                                    <button onClick={() => setSelectedUser(null)} className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-gray-400">Change</button>
                                </div>
                                
                                <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-500/20 space-y-3">
                                    <div>
                                        <label className="text-[10px] text-gray-500 uppercase font-bold">Name</label>
                                        <p className="text-lg font-bold text-white">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-500 uppercase font-bold">Email</label>
                                        <p className="text-sm text-gray-300">{selectedUser.email}</p>
                                        {isKare && <p className="text-[10px] text-green-500 font-bold mt-1">✓ KARE Student Detected</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold">Phone</label>
                                            <p className="text-sm text-gray-300">{selectedUser.phone}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-500 uppercase font-bold">College</label>
                                            <p className="text-sm text-gray-300 truncate">{selectedUser.collage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add-ons Panel (Disabled if no user) */}
                    <div className={`bg-[#111] border border-white/10 rounded-2xl p-6 transition-opacity ${!selectedUser ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Upgrades</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                type="button"
                                onClick={() => setAddons(p => ({...p, proshow: !p.proshow}))}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${addons.proshow ? 'bg-purple-900/30 border-purple-500 text-purple-300' : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/30'}`}
                            >
                                <span className="font-bold">Pro Show</span>
                                <span className="text-xs">₹{PRICES.PRO_SHOW}</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setAddons(p => ({...p, accommodation: !p.accommodation}))}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${addons.accommodation ? 'bg-blue-900/30 border-blue-500 text-blue-300' : 'bg-black/40 border-white/10 text-gray-500 hover:border-white/30'}`}
                            >
                                <span className="font-bold">Stay</span>
                                <span className="text-xs">₹{PRICES.ACCOMMODATION}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MIDDLE: Event Selector (5 Cols) */}
                <div className={`lg:col-span-5 bg-[#111] border border-white/10 rounded-2xl flex flex-col overflow-hidden max-h-full transition-opacity ${!selectedUser ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="p-4 border-b border-white/10 bg-[#151515]">
                        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Ticket size={18} className="text-amber-500"/> Select Events</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input 
                                value={searchEvent} 
                                onChange={e => setSearchEvent(e.target.value)} 
                                className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-amber-500 outline-none" 
                                placeholder="Search events..." 
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {loadingEvents ? (
                            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-600"/></div>
                        ) : filteredEvents.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No events found</div>
                        ) : (
                            filteredEvents.map(event => {
                                const isSelected = selectedEvents.find(e => e.id === event.id);
                                return (
                                    <div 
                                        key={event.id} 
                                        onClick={() => handleEventToggle(event)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center group ${isSelected ? 'bg-amber-900/20 border-amber-500/50' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                                    >
                                        <div className="min-w-0">
                                            <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-amber-400' : 'text-gray-300'}`}>{event.title}</h4>
                                            <div className="flex gap-2 text-[10px] text-gray-500 mt-0.5">
                                                <span className="bg-white/5 px-1.5 py-0.5 rounded">{event.category}</span>
                                                <span>{event.time}</span>
                                            </div>
                                        </div>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-white/20 group-hover:border-white/40'}`}>
                                            {isSelected && <CheckCircle size={14} className="text-black" />}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* RIGHT: Cart & Checkout (3 Cols) */}
                <div className={`lg:col-span-3 flex flex-col gap-4 transition-opacity ${!selectedUser ? 'opacity-50' : ''}`}>
                    <div className="bg-[#151515] border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/10 bg-black/40">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={18}/> Cart Summary</h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {!selectedUser ? (
                                <div className="text-center text-gray-600 py-10 text-xs">Select user to begin</div>
                            ) : selectedEvents.length === 0 && !addons.proshow && !addons.accommodation ? (
                                <div className="text-center text-gray-600 py-10 text-xs">Cart is empty</div>
                            ) : (
                                <>
                                    {/* Registration Fee */}
                                    <div className="flex justify-between text-xs py-2 border-b border-white/5">
                                        <span className="text-gray-400">Reg. Fee</span>
                                        {isKare ? <span className="text-green-500">WAIVED</span> : <span>₹{selectedEvents.length > 0 ? PRICES.EVENT_REGISTRATION : 0}</span>}
                                    </div>

                                    {/* Events List */}
                                    {selectedEvents.map(e => (
                                        <div key={e.id} className="flex justify-between items-center text-xs text-gray-300">
                                            <span className="truncate flex-1 pr-2">{e.title}</span>
                                            <button onClick={() => handleEventToggle(e)} className="text-red-500 hover:bg-red-500/10 p-1 rounded"><Trash2 size={12}/></button>
                                        </div>
                                    ))}

                                    {/* Addons */}
                                    {addons.proshow && (
                                        <div className="flex justify-between text-xs text-purple-300 bg-purple-900/10 p-2 rounded">
                                            <span>Pro Show</span>
                                            <span>₹{PRICES.PRO_SHOW}</span>
                                        </div>
                                    )}
                                    {addons.accommodation && (
                                        <div className="flex justify-between text-xs text-blue-300 bg-blue-900/10 p-2 rounded">
                                            <span>Accommodation</span>
                                            <span>₹{PRICES.ACCOMMODATION}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="p-5 bg-gradient-to-t from-black to-[#111] border-t border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-gray-400 text-xs font-bold uppercase">Total Payable</span>
                                <span className="text-3xl font-black text-amber-500 leading-none">₹{calculateTotal()}</span>
                            </div>
                            
                            <div className="flex gap-2 mb-4">
                                <button type="button" onClick={handleReset} className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                    <RefreshCw size={18} className="text-gray-400"/>
                                </button>
                                <button 
                                    onClick={initiatePayment}
                                    disabled={!selectedUser || isSubmitting}
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> CONFIRM & PAY</>}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center">
                                CASH ON HAND Verification Required
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* PAYMENT CONFIRMATION MODAL */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#181818] border border-white/10 rounded-2xl shadow-2xl p-6 relative"
                        >
                            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
                            
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 text-amber-500">
                                    <Lock size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Authorize Payment</h3>
                                <p className="text-sm text-gray-400 mt-1">Cash Collection Verification</p>
                            </div>

                            <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Payer</span>
                                    <span className="text-white">{selectedUser?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-400">Amount</span>
                                    <span className="text-amber-500 font-bold">₹{calculateTotal()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Events</span>
                                    <span className="text-white">{selectedEvents.length} Selected</span>
                                </div>
                            </div>

                            <form onSubmit={handleConfirmPayment} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs uppercase font-bold text-gray-500 ml-1">Desk Confirmation Password</label>
                                    <div className="relative">
                                        <input 
                                            autoFocus
                                            type="password" 
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pl-10 focus:border-amber-500 outline-none transition-colors text-white" 
                                            placeholder="Enter Payment Password"
                                        />
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                                    </div>
                                    <p className="text-[10px] text-gray-600 ml-1">Ask for Desk Key (Default: Payment@123)</p>
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-3.5 rounded-xl transition-all"
                                >
                                    VERIFY & SUBMIT
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OnSpotPage;