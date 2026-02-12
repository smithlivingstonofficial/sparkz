
import React from 'react';
import { X, QrCode, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    if (!isOpen || !user) return null;

    // Generate QR Code URL using the user ID
    // Data format expected by scanner: BACKEND_URL/user/<id> or similar unique identifier
    const qrData = `${import.meta.env.VITE_API_URL || 'http://localhost:6500'}/user/${user._id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950/50">
                        <h2 className="text-xl font-bold font-['Cinzel'] text-amber-500">Participant Profile</h2>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col items-center gap-6">

                        {/* User Info */}
                        <div className="text-center w-full">
                            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                                <span className="text-3xl font-bold text-amber-500 uppercase">
                                    {user.name ? user.name.charAt(0) : 'U'}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
                            <p className="text-zinc-400 mb-1">{user.email}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">ID: {user._id}</p>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-white p-4 rounded-xl shadow-lg">
                            <img
                                src={qrCodeUrl}
                                alt="User QR Code"
                                className="w-48 h-48 object-contain"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 text-center px-4">
                            Show this QR code at the event entrance for verification.
                        </p>

                        {/* Stats / Badges Placeholder */}
                        {user.proshow && user.proshow.length > 0 && (
                            <div className='w-full bg-zinc-800/50 rounded-lg p-3'>
                                <h4 className='text-sm font-semibold text-zinc-300 mb-2'>Registered Events</h4>
                                <div className='flex flex-wrap gap-2'>
                                    {user.proshow.map((event, idx) => (
                                        <span key={idx} className='text-xs bg-amber-900/40 text-amber-300 px-2 py-1 rounded border border-amber-500/20'>
                                            {event.type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="w-full pt-4 border-t border-zinc-800 mt-2">
                            <button
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition-all"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProfileModal;
