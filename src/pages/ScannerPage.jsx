import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Scan, User, Calendar, Crown, CheckCircle, XCircle, RefreshCw, Smartphone, MapPin, Clock, CreditCard, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScannerPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const scannerRef = useRef(null);

    const API_URL = "https://sparkz-server.onrender.com";

    useEffect(() => {
        // Initialize scanner only if not already scanned and not loading
        if (!scanResult && !userData && !loading) {
            const scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;

            // Cleanup function
            return () => {
                if (scannerRef.current) {
                    try {
                        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
                    } catch (e) {
                        console.error("Error clearing scanner", e);
                    }
                }
            };
        }
    }, [scanResult, userData, loading]);

    const onScanSuccess = (decodedText) => {
        if (scannerRef.current) {
            try {
                scannerRef.current.clear();
            } catch (e) {
                console.error("Error clearing scanner on success", e);
            }
        }
        setScanResult(decodedText);
        fetchUserData(decodedText);
    };

    const onScanFailure = (error) => {
        // Handle scan failure, usually better to ignore to avoid console spam
        // console.warn(`Code scan error = ${error}`);
    };

    const fetchUserData = async (qrData) => {
        setLoading(true);
        setError(null);
        try {
            // Extract ID from URL if it's a URL
            // Format: https://api.qrserver.com/v1/create-qr-code/?data=BACKEND_URL/user/USER_ID
            // Actually, the QR seems to contain just the URL: BACKEND_URL/user/USER_ID
            // Let's assume the QR contains the full URL to fetch the user.

            let fetchUrl = qrData;

            // Basic validation/extraction if needed. 
            // If the QR code is just the user ID, construct the URL.
            if (!qrData.startsWith('http')) {
                fetchUrl = `${API_URL}/user/${qrData}`;
            }

            const res = await axios.get(fetchUrl);
            setUserData(res.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user details. Invalid QR code or network error.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setScanResult(null);
        setUserData(null);
        setError(null);
        // The useEffect will re-initialize the scanner
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-black text-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Cinzel'] text-amber-500 mb-4">
                        Event Scanner
                    </h1>
                    <p className="text-xl text-white/60">
                        Scan QR code to verify registration details
                    </p>
                </div>

                {!userData && !loading && !error && (
                    <div className="max-w-md mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 shadow-2xl">
                        <div id="reader" className="overflow-hidden rounded-xl"></div>
                        <p className="text-center text-sm text-white/40 mt-4">
                            Point camera at the QR code
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-xl font-medium text-amber-400">Verifying Ticket...</p>
                    </div>
                )}

                {error && (
                    <div className="max-w-md mx-auto text-center py-12 px-6 bg-red-900/20 border border-red-500/30 rounded-2xl">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-red-400 mb-2">Verification Failed</h3>
                        <p className="text-white/70 mb-8">{error}</p>
                        <button
                            onClick={handleReset}
                            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Scan Again
                        </button>
                    </div>
                )}

                {userData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* User Profile Card */}
                        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <User className="w-64 h-64 text-amber-500" />
                            </div>

                            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold tracking-wider border border-amber-500/20">
                                            VERIFIED ATTENDEE
                                        </div>
                                        {userData.email?.endsWith('@klu.ac.in') && (
                                            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold tracking-wider border border-blue-500/20">
                                                KARE STUDENT
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{userData.name}</h2>
                                    <p className="text-white/60 text-lg mb-6">{userData.email}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        {userData.phone && (
                                            <div className="flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                                                <Smartphone className="w-4 h-4 text-amber-500" />
                                                <span>{userData.phone}</span>
                                            </div>
                                        )}
                                        {userData.role && (
                                            <div className="flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                                                <User className="w-4 h-4 text-amber-500" />
                                                <span>{userData.role.toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="col-span-1 sm:col-span-2 flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                                            <div className="font-bold text-amber-500 flex-shrink-0">ID:</div>
                                            <span className="truncate">{userData._id?.$oid || userData._id}</span>
                                        </div>
                                        {userData.college && (
                                            <div className="col-span-1 sm:col-span-2 flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                                                <div className="font-bold text-amber-500 flex-shrink-0">College:</div>
                                                <span>{userData.college}</span>
                                            </div>
                                        )}
                                        {userData.accommodation !== undefined && (
                                            <div className="col-span-1 sm:col-span-2 flex items-center gap-3 text-white/80 bg-white/5 p-3 rounded-lg">
                                                <div className="font-bold text-amber-500 flex-shrink-0">Accommodation:</div>
                                                <span className={userData.accommodation ? "text-green-400 font-bold" : "text-white/60"}>
                                                    {userData.accommodation ? "Yes (Required)" : "No"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 w-full">
                                        <div className="text-4xl font-bold text-amber-500 mb-1">
                                            {(userData.events?.length || 0) + (userData.proshow?.length || 0)}
                                        </div>
                                        <div className="text-sm text-white/50 uppercase tracking-widest">Total Registrations</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Proshows Section */}
                        {userData.proshow && (Array.isArray(userData.proshow) ? userData.proshow.length > 0 : Object.keys(userData.proshow).length > 0) && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-amber-400 flex items-center gap-3 animate-pulse">
                                    <Crown className="w-8 h-8 text-amber-400" />
                                    PROSHOW REGISTRATION
                                </h3>
                                <div className="grid gap-6">
                                    {(Array.isArray(userData.proshow) ? userData.proshow : [userData.proshow]).map((show, index) => (
                                        <div key={index} className="bg-gradient-to-r from-amber-600/20 via-amber-900/40 to-black border-2 border-amber-500 rounded-2xl p-6 relative overflow-hidden group hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all">
                                            {/* Decorative Background Effects */}
                                            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-amber-500/30 rounded-full blur-3xl pointer-events-none"></div>
                                            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>

                                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="px-4 py-1.5 bg-amber-500 text-black text-sm font-extrabold tracking-wider rounded-full shadow-lg shadow-amber-500/40">
                                                            {show.type ? `${show.type} PASS` : 'VIP ACCESS'}
                                                        </span>
                                                        <span className="text-amber-400 font-bold text-xl">₹{show.price || 'PAID'}</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black text-white mb-3 uppercase tracking-wide">
                                                        {show.name || 'Sparkz Elite Proshow'}
                                                    </h4>

                                                    <div className="flex flex-wrap gap-4 text-sm text-amber-100/80 bg-black/50 p-3 rounded-xl border border-amber-500/30 shadow-inner">
                                                        {(show.transactionId || show.upiId) ? (
                                                            <>
                                                                {show.transactionId && (
                                                                    <div className="flex items-center gap-2">
                                                                        <CreditCard className="w-4 h-4 text-amber-400" />
                                                                        <span className="font-mono">{show.transactionId}</span>
                                                                    </div>
                                                                )}
                                                                {show.upiId && (
                                                                    <div className="flex items-center gap-2 border-l border-amber-500/30 pl-4">
                                                                        <span className="font-bold text-amber-500">UPI:</span>
                                                                        <span className="font-mono">{show.upiId}</span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                                <span className="text-green-400 font-medium">Verified Payment</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {show.paymentScreenshot && (
                                                    <div className="flex-shrink-0 mt-4 md:mt-0">
                                                        <a
                                                            href={show.paymentScreenshot}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105"
                                                        >
                                                            <ImageIcon className="w-5 h-5" />
                                                            View Proof
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Global Payment Details */}
                        {(userData.transactionId || userData.paymentScreenshot || userData.upiId) && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-green-400" />
                                    Payment Details
                                </h3>
                                <div className="bg-gradient-to-r from-green-900/20 to-black border border-green-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-all">
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <div className="flex flex-wrap gap-4 text-sm text-white/80">
                                                {userData.transactionId && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-green-500/80">TXN:</span>
                                                        <span className="font-mono">{userData.transactionId}</span>
                                                    </div>
                                                )}
                                                {userData.upiId && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-green-500/80">UPI:</span>
                                                        <span className="font-mono">{userData.upiId}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {userData.paymentScreenshot && (
                                            <div className="flex-shrink-0">
                                                <a
                                                    href={userData.paymentScreenshot}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-green-400 transition-colors"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                    View Proof
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Events Section */}
                        {userData.events && userData.events.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-blue-400" />
                                    Registered Events
                                </h3>
                                <div className="grid gap-4">
                                    {userData.events.map((eventGroup, idx) => {
                                        // Handle both single event object and array of events structure from previous implementation
                                        const events = Array.isArray(eventGroup) ? eventGroup : (eventGroup.event ? (Array.isArray(eventGroup.event) ? eventGroup.event : [eventGroup.event]) : [eventGroup]);

                                        // The outer object might contain payment details
                                        const entryPayment = {
                                            transactionId: eventGroup.transactionId,
                                            screenshot: eventGroup.paymentScreenshot
                                        };

                                        return events.map((event, eventIdx) => (
                                            <div key={`${idx}-${eventIdx}`} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{event.category || 'General'}</span>
                                                            {event.day && <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">{event.day}</span>}
                                                        </div>
                                                        <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                                                        <p className="text-white/60 text-sm mb-4 line-clamp-2">{event.tagline || event.description}</p>

                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-white/50">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-3 h-3" />
                                                                <span>{event.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{event.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-3 h-3" />
                                                                <span>{event.venue}</span>
                                                            </div>
                                                        </div>

                                                        {/* Payment details if available on the parent object */}
                                                        {(entryPayment.transactionId || entryPayment.screenshot) && (
                                                            <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-xs">
                                                                {entryPayment.transactionId && (
                                                                    <div className="text-white/40">TXN: <span className="text-white/70 font-mono">{entryPayment.transactionId}</span></div>
                                                                )}
                                                                {entryPayment.screenshot && (
                                                                    <a href={entryPayment.screenshot} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                                                        <ImageIcon className="w-3 h-3" /> Proof
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ));
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center pt-8">
                            <button
                                onClick={handleReset}
                                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 transform hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Scan className="w-6 h-6" />
                                Scan Next Ticket
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ScannerPage;
