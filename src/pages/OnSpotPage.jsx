import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
    UserPlus, Search, CheckCircle, Loader2, 
    Ticket, CreditCard, RefreshCw, Trash2, 
    ShoppingCart, LogOut
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

const OnSpotPage = () => {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', collage: '', 
        year: '', dept: '', password: 'SparkzUser2026'
    });

    // Event & Cart State
    const [availableEvents, setAvailableEvents] = useState([]); // Renamed for clarity
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [addons, setAddons] = useState({ proshow: false, accommodation: false });
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [searchEvent, setSearchEvent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Authentication ---
    useEffect(() => {
        const auth = sessionStorage.getItem("onspot_auth");
        if (auth === "true") setIsAuthenticated(true);
        
        // 2. Load events from the imported JSON data
        setAvailableEvents(eventsData);
        setLoadingEvents(false);

    }, []);

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

    // --- Logic ---
    const isKare = useMemo(() => formData.email.toLowerCase().includes("@klu.ac.in"), [formData.email]);

    const calculateTotal = () => {
        let total = 0;
        if (selectedEvents.length > 0 && !isKare) total += PRICES.EVENT_REGISTRATION;
        if (addons.proshow) total += PRICES.PRO_SHOW;
        if (addons.accommodation) total += PRICES.ACCOMMODATION;
        return total;
    };

    const handleEventToggle = (event) => {
        if (selectedEvents.find(e => e.id === event.id)) {
            setSelectedEvents(prev => prev.filter(e => e.id !== event.id));
        } else {
            setSelectedEvents(prev => [...prev, event]);
        }
    };

    const handleReset = () => {
        setFormData({ name: '', email: '', phone: '', collage: '', year: '', dept: '', password: 'SparkzUser2026' });
        setSelectedEvents([]);
        setAddons({ proshow: false, accommodation: false });
        toast.success("Form Cleared");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) return toast.error("Fill required user details");
        
        setIsSubmitting(true);
        try {
            // 1. Register User
            const regRes = await axios.post(`${API}/auth/register`, formData);
            const newUser = regRes.data;

            // 2. Book Events (if any)
            if (selectedEvents.length > 0 || addons.proshow || addons.accommodation) {
                const bookingPayload = {
                    user: newUser,
                    event: selectedEvents,
                    proshow: addons.proshow,
                    accommodation: addons.accommodation,
                    transactionId: `SPOT-${Date.now()}`,
                    upiId: "CASH/POS",
                    totalAmount: calculateTotal(),
                    paymentScreenshot: "https://placehold.co/600x400/000000/FFF?text=OnSpot+Verified" 
                };
                await axios.post(`${API}/user/event/normal`, bookingPayload);
            }

            toast.success( `User ${newUser.name} Registered!`, { duration: 4000 });
            handleReset();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Registration Failed");
        } finally {
            setIsSubmitting(false);
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
                <button onClick={handleLogout} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"><LogOut size={20}/></button>
            </header>

            <main className="pt-24 pb-12 px-4 md:px-6 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-6 h-screen">
                
                {/* LEFT: User Form (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-20">
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2"><UserPlus size={20}/> Attendee Details</h2>
                        <form id="reg-form" onSubmit={handleSubmit} className="space-y-4">
                            {/* Form Inputs (same as before) */}
                             <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Full Name *</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="John Doe" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Email Address *</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="student@college.edu" />
                                {isKare && <p className="text-[10px] text-green-500 font-bold ml-1">✓ KARE Student Detected (Fee Waived)</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Phone *</label>
                                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="9876543210" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Year</label>
                                    <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors text-gray-300">
                                        <option value="">Select</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">College Name *</label>
                                <input required value={formData.collage} onChange={e => setFormData({...formData, collage: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="University Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500 uppercase font-bold ml-1">Department</label>
                                <input value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="CSE, ECE, Mech..." />
                            </div>
                        </form>
                    </div>

                    {/* Add-ons Panel */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
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
                <div className="lg:col-span-5 bg-[#111] border border-white/10 rounded-2xl flex flex-col overflow-hidden max-h-full">
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
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <div className="bg-[#151515] border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/10 bg-black/40">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={18}/> Cart Summary</h2>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {selectedEvents.length === 0 && !addons.proshow && !addons.accommodation ? (
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
                                    form="reg-form" 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><CreditCard size={18} /> CONFIRM & PAY</>}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-500 text-center">
                                *Verifies user instantly as "Verified"
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OnSpotPage;