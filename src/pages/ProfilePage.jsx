import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Calendar, MapPin, Ticket, CreditCard, 
  Settings, LogOut, Clock, Award, Star, Film, 
  ShoppingBag, Download, Shield, Edit2, CheckCircle,
  AlertCircle, TrendingUp, DollarSign, QrCode
} from 'lucide-react';

// Mock user data
const userData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@sparkz.edu',
  memberSince: 'Feb 2026',
  avatar: null, // Placeholder for avatar
  college: 'Kalasalingam Academy of Research and Education',
  department: 'Computer Science Engineering',
  year: '3rd Year',
  totalEvents: 8,
  totalSpent: 2400,
  loyaltyPoints: 450,
};

// Mock registered events
const registeredEvents = [
  {
    id: 1,
    title: 'VALORANT',
    tagline: 'Online Tactical Esports Tournament',
    date: 'Feb 27, 2026',
    time: '10:00 AM',
    venue: 'Online',
    category: 'gaming',
    status: 'upcoming',
    price: 300,
    transactionId: 'TXN123456789',
  },
  {
    id: 2,
    title: 'CINEMATIC DANCE BATTLE',
    tagline: 'Show your moves on the big screen',
    date: 'Feb 28, 2026',
    time: '04:00 PM',
    venue: 'Main Stage',
    category: 'dance',
    status: 'upcoming',
    price: 200,
    transactionId: 'TXN987654321',
  },
  {
    id: 3,
    title: 'STAR STUDIO PRO SHOW',
    tagline: 'Featuring International Crews',
    date: 'Feb 27, 2026',
    time: '07:00 PM',
    venue: 'Open Air Theatre',
    category: 'music',
    status: 'upcoming',
    price: 500,
    transactionId: 'TXN456789123',
  },
];

// Mock payment history
const paymentHistory = [
  {
    id: 'PAY001',
    date: 'Feb 20, 2026',
    amount: 500,
    events: 'STAR STUDIO PRO SHOW',
    status: 'success',
    transactionId: 'TXN456789123',
  },
  {
    id: 'PAY002',
    date: 'Feb 18, 2026',
    amount: 300,
    events: 'VALORANT',
    status: 'success',
    transactionId: 'TXN123456789',
  },
  {
    id: 'PAY003',
    date: 'Feb 15, 2026',
    amount: 200,
    events: 'CINEMATIC DANCE BATTLE',
    status: 'success',
    transactionId: 'TXN987654321',
  },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [isEditing, setIsEditing] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-500/10 to-transparent" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-amber-500/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animation: `float ${Math.random() * 8 + 4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Profile Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-md rounded-2xl border border-amber-500/30 p-6"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-amber-600 to-red-600 p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-amber-400" />
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black"></div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{userData.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" /> {userData.email}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Member since {userData.memberSince}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {userData.college}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-amber-300">
                    {userData.department} • {userData.year}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 hover:from-amber-600/30 hover:to-red-600/30 rounded-lg border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-all flex items-center gap-2 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600/30 hover:to-rose-600/30 rounded-lg border border-red-500/30 text-red-400 hover:text-red-300 transition-all flex items-center gap-2 text-sm">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-lg">
                <Ticket className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase">Events</div>
                <div className="text-2xl font-bold text-white">{userData.totalEvents}</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase">Total Spent</div>
                <div className="text-2xl font-bold text-white">₹{userData.totalSpent}</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-lg">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase">Loyalty</div>
                <div className="text-2xl font-bold text-white">{userData.loyaltyPoints}</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white/60 text-xs uppercase">Rank</div>
                <div className="text-2xl font-bold text-white">#42</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'events'
                  ? 'text-amber-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>My Events</span>
              </div>
              {activeTab === 'events' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-red-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'payments'
                  ? 'text-amber-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Payment History</span>
              </div>
              {activeTab === 'payments' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-red-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-sm font-medium transition-all relative ${
                activeTab === 'settings'
                  ? 'text-amber-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </div>
              {activeTab === 'settings' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-red-500"
                />
              )}
            </button>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {/* My Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                {registeredEvents.length > 0 ? (
                  registeredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4 hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-r from-amber-600/20 to-red-600/20 rounded-lg">
                            <Ticket className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{event.title}</h4>
                            <p className="text-amber-300 text-sm">{event.tagline}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {event.venue}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6">
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Paid</div>
                            <div className="text-lg font-bold text-amber-400">₹{event.price}</div>
                          </div>
                          <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                            <span className="text-green-400 text-xs font-bold">UPCOMING</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-black/40 to-gray-900/40 rounded-2xl border border-amber-500/20">
                    <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No events yet</h3>
                    <p className="text-gray-400 mb-6">You haven't registered for any events</p>
                    <a
                      href="/events"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Film className="w-4 h-4" />
                      <span>Browse Events</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-4">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gradient-to-r from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{payment.events}</h4>
                            <p className="text-gray-400 text-xs mt-1">
                              Transaction ID: <span className="text-amber-300">{payment.transactionId}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {payment.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <QrCode className="w-3 h-3" /> {payment.id}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6">
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Amount</div>
                            <div className="text-lg font-bold text-amber-400">₹{payment.amount}</div>
                          </div>
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-gray-400 hover:text-amber-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-black/40 to-gray-900/40 rounded-2xl border border-amber-500/20">
                    <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No payment history</h3>
                    <p className="text-gray-400">Your transactions will appear here</p>
                  </div>
                )}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-400" />
                    <span>Personal Information</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={userData.name}
                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">College</label>
                      <input
                        type="text"
                        defaultValue={userData.college}
                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Department</label>
                      <input
                        type="text"
                        defaultValue={userData.department}
                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white"
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-sm rounded-xl border border-amber-500/20 p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <span>Security & Preferences</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">UPI ID</label>
                      <input
                        type="text"
                        defaultValue="alex@okhdfcbank"
                        className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transition-all text-white"
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Two-Factor Authentication</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-600 peer-checked:to-red-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Email Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-600 peer-checked:to-red-600"></div>
                      </label>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex gap-3">
                      <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex-1">
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;